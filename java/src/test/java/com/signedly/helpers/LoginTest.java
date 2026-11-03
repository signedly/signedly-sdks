package com.signedly.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.signedly.api.DocumentsApi;
import com.signedly.model.Upload;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

/**
 * SignedlyAuth.client logs in first and sends the token on every request, and an
 * upload goes as multipart/form-data with the file's bytes and its length (as the real
 * API needs).
 */
class LoginTest {
  private static void answer(HttpExchange exchange, int status, String body) throws IOException {
    byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
    exchange.getResponseHeaders().add("Content-Type", "application/json");
    exchange.sendResponseHeaders(status, bytes.length);
    exchange.getResponseBody().write(bytes);
    exchange.close();
  }

  @Test
  void requestsCarryTheToken() throws Exception {
    List<String> seen = new ArrayList<>();
    HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext(
        "/ap1/token/",
        exchange -> {
          seen.add("token");
          OffsetDateTime now = OffsetDateTime.now();
          answer(
              exchange,
              200,
              "{\"access_token\": \"tok-1\", \"refresh_token\": \"ref-1\", \"expiry_date\": \""
                  + now.plusHours(2)
                  + "\", \"refresh_token_expiry_date\": \""
                  + now.plusDays(7)
                  + "\"}");
        });
    server.createContext(
        "/ap1/documents/",
        exchange -> {
          String auth = exchange.getRequestHeaders().getFirst("Authorization");
          seen.add("documents " + auth);
          if ("Bearer tok-1".equals(auth)) {
            answer(exchange, 200, "{\"count\": 0, \"next\": null, \"previous\": null, \"results\": []}");
          } else {
            answer(exchange, 403, "{\"detail\": \"Client not found\"}");
          }
        });
    server.createContext(
        "/ap1/upload/",
        exchange -> {
          String type = exchange.getRequestHeaders().getFirst("Content-Type");
          String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.ISO_8859_1);
          // The real API reads no body from a chunked request: it must come with its length.
          String length = exchange.getRequestHeaders().getFirst("Content-Length");
          seen.add(
              "upload "
                  + type.split(";")[0]
                  + " "
                  + body.contains("%PDF-1.4 test")
                  + " length "
                  + (length != null)
                  + " "
                  + body.contains("Content-Type: application/pdf"));
          answer(exchange, 200, "{\"id\": \"00000000-0000-0000-0000-000000000001\", \"is_test\": true}");
        });
    server.start();
    try {
      String host = "http://127.0.0.1:" + server.getAddress().getPort();
      DocumentsApi documents = new DocumentsApi(SignedlyAuth.client("id", "secret", host));
      assertEquals(0, documents.listDocuments(null, null, null, null, null).getCount());
      Path pdf = Files.createTempFile("t", ".pdf");
      Files.write(pdf, "%PDF-1.4 test".getBytes(StandardCharsets.ISO_8859_1));
      Upload upload = documents.uploadDocument(pdf.toFile(), "t", 2, null);
      assertEquals(true, upload.getIsTest());
      assertEquals(
          List.of("token", "documents Bearer tok-1", "upload multipart/form-data true length true true"), seen);
    } finally {
      server.stop(0);
    }
  }
}
