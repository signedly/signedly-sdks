package com.signedly.helpers;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;

class WebhookTest {
  private static String sign(String secret, long t, String body) throws Exception {
    Mac mac = Mac.getInstance("HmacSHA256");
    mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
    StringBuilder hex = new StringBuilder();
    for (byte b : mac.doFinal((t + "." + body).getBytes(StandardCharsets.UTF_8))) {
      hex.append(String.format("%02x", b));
    }
    return "t=" + t + ",v1=" + hex;
  }

  @Test
  void goodSignatureVerifiesAndBadOnesFail() throws Exception {
    String header = sign("whsec_x", 1000, "{\"id\":\"1\"}");
    assertTrue(Webhook.verifySignature("whsec_x", header, "{\"id\":\"1\"}", 1000));
    assertFalse(Webhook.verifySignature("whsec_y", header, "{\"id\":\"1\"}", 1000));
    assertFalse(Webhook.verifySignature("whsec_x", header, "{\"id\":\"2\"}", 1000));
    assertFalse(Webhook.verifySignature("whsec_x", header, "{\"id\":\"1\"}", 1301));
    assertFalse(Webhook.verifySignature("whsec_x", "garbage", "{}", 1000));
  }
}
