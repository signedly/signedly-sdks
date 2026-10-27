package com.signedly.helpers;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/** Hand-written helper, kept when the SDK is regenerated (.openapi-generator-ignore). */
public final class Webhook {
  private static final long TOLERANCE_SECONDS = 300;

  private Webhook() {}

  /** True if the Signedly-Signature header signs this raw body, made within 5 minutes. */
  public static boolean verifySignature(String secret, String signatureHeader, String rawBody) {
    return verifySignature(secret, signatureHeader, rawBody, System.currentTimeMillis() / 1000);
  }

  public static boolean verifySignature(
      String secret, String signatureHeader, String rawBody, long nowSeconds) {
    Map<String, String> parts = new HashMap<>();
    for (String item : (signatureHeader == null ? "" : signatureHeader).split(",")) {
      int at = item.indexOf('=');
      if (at > 0) {
        parts.put(item.substring(0, at), item.substring(at + 1));
      }
    }
    long timestamp;
    try {
      timestamp = Long.parseLong(parts.get("t"));
    } catch (NumberFormatException | NullPointerException e) {
      return false;
    }
    if (parts.get("v1") == null || Math.abs(nowSeconds - timestamp) > TOLERANCE_SECONDS) {
      return false;
    }
    try {
      Mac mac = Mac.getInstance("HmacSHA256");
      mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
      byte[] digest = mac.doFinal((timestamp + "." + rawBody).getBytes(StandardCharsets.UTF_8));
      StringBuilder expected = new StringBuilder();
      for (byte b : digest) {
        expected.append(String.format("%02x", b));
      }
      return MessageDigest.isEqual(
          expected.toString().getBytes(StandardCharsets.UTF_8),
          parts.get("v1").getBytes(StandardCharsets.UTF_8));
    } catch (Exception e) {
      return false;
    }
  }
}
