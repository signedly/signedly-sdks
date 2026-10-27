// node --test helpers.test.mjs (after npm run build)
import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";
import { verifyWebhookSignature } from "./dist/helpers.js";

const sign = (secret, t, body) =>
    `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

test("a good signature verifies; wrong secret, body or age fail", () => {
    const header = sign("whsec_x", 1000, '{"id":"1"}');
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"1"}', 1000), true);
    assert.equal(verifyWebhookSignature("whsec_y", header, '{"id":"1"}', 1000), false);
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"2"}', 1000), false);
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"1"}', 1301), false);
    assert.equal(verifyWebhookSignature("whsec_x", "garbage", "{}", 1000), false);
});
