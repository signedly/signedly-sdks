package com.signedly.helpers;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/** Hand-written helper, kept when the SDK is regenerated (.openapi-generator-ignore). */
public final class Webhook {
  private static final long TOLERANCE_SECONDS = 300;

  private Webhook() {}

  /**
   * True if the Signedly-Signature header signs this raw body, made within 5 minutes; with
   * several v1 values (a secret rotation), any of them may match.
   */
  public static boolean verifySignature(String secret, String signatureHeader, String rawBody) {
    return verifySignature(secret, signatureHeader, rawBody, System.currentTimeMillis() / 1000);
  }

  public static boolean verifySignature(
      String secret, String signatureHeader, String rawBody, long nowSeconds) {
    // During a secret rotation the header carries one v1 per secret
    // (t=…,v1=<new>,v1=<old>): any of them may match.
    String t = null;
    List<String> signatures = new ArrayList<>();
    for (String item : (signatureHeader == null ? "" : signatureHeader).split(",")) {
      int at = item.indexOf('=');
      if (at <= 0) {
        continue;
      }
      String key = item.substring(0, at);
      String value = item.substring(at + 1);
      if (key.equals("t")) {
        t = value;
      } else if (key.equals("v1") && !value.isEmpty()) {
        signatures.add(value);
      }
    }
    long timestamp;
    try {
      timestamp = Long.parseLong(t);
    } catch (NumberFormatException | NullPointerException e) {
      return false;
    }
    if (signatures.isEmpty() || Math.abs(nowSeconds - timestamp) > TOLERANCE_SECONDS) {
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
      byte[] wanted = expected.toString().getBytes(StandardCharsets.UTF_8);
      for (String signature : signatures) {
        if (MessageDigest.isEqual(wanted, signature.getBytes(StandardCharsets.UTF_8))) {
          return true;
        }
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }
}
