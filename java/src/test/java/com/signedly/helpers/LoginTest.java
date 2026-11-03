package com.signedly.helpers;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.signedly.api.DocumentsApi;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

/** SignedlyAuth.client logs in first and sends the token on every request. */
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
    server.start();
    try {
      String host = "http://127.0.0.1:" + server.getAddress().getPort();
      DocumentsApi documents = new DocumentsApi(SignedlyAuth.client("id", "secret", host));
      assertEquals(0, documents.listDocuments(null, null, null, null, null).getCount());
      assertEquals(List.of("token", "documents Bearer tok-1"), seen);
    } finally {
      server.stop(0);
    }
  }
}
