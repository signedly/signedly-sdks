// node --test helpers.test.mjs (after npm run build)
import { createHmac } from "node:crypto";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { DocumentsApi } from "./dist/index.js";
import { SignedlyAuthError, signedlyConfiguration, verifyWebhookSignature } from "./dist/helpers.js";

const sign = (secret, t, body) =>
    `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${body}`).digest("hex")}`;

// Webhook signatures ------------------------------------------------------------

test("a good signature verifies; wrong secret, body or age fail", () => {
    const header = sign("whsec_x", 1000, '{"id":"1"}');
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"1"}', 1000), true);
    assert.equal(verifyWebhookSignature("whsec_y", header, '{"id":"1"}', 1000), false);
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"2"}', 1000), false);
    assert.equal(verifyWebhookSignature("whsec_x", header, '{"id":"1"}', 1301), false);
    assert.equal(verifyWebhookSignature("whsec_x", "garbage", "{}", 1000), false);
});

test("a signature from the future beyond 5 minutes fails; within 5 minutes passes", () => {
    const header = sign("whsec_x", 1000, "{}");
    assert.equal(verifyWebhookSignature("whsec_x", header, "{}", 699), false);
    assert.equal(verifyWebhookSignature("whsec_x", header, "{}", 700), true);
    assert.equal(verifyWebhookSignature("whsec_x", header, "{}", 1300), true);
});

test("a Buffer body verifies like the same text", () => {
    const header = sign("whsec_x", 1000, '{"id":"1"}');
    assert.equal(verifyWebhookSignature("whsec_x", header, Buffer.from('{"id":"1"}'), 1000), true);
});

test("malformed headers fail without throwing", () => {
    for (const header of ["", "t=abc,v1=00", "v1=00", "t=1000", "t=1000,v1=", ",,,", "t=1000,v1=zz"]) {
        assert.equal(verifyWebhookSignature("whsec_x", header, "{}", 1000), false, header);
    }
    assert.equal(verifyWebhookSignature("whsec_x", undefined, "{}", 1000), false);
});

test("during a secret rotation either secret's v1 verifies, in any order", () => {
    const body = '{"id":"1"}';
    const v1 = (secret) => sign(secret, 1000, body).split(",v1=")[1];
    const both = `t=1000,v1=${v1("whsec_new")},v1=${v1("whsec_old")}`;
    const reversed = `t=1000,v1=${v1("whsec_old")},v1=${v1("whsec_new")}`;
    for (const header of [both, reversed]) {
        assert.equal(verifyWebhookSignature("whsec_new", header, body, 1000), true);
        assert.equal(verifyWebhookSignature("whsec_old", header, body, 1000), true);
        assert.equal(verifyWebhookSignature("whsec_other", header, body, 1000), false);
    }
    assert.equal(verifyWebhookSignature("whsec_new", `t=1000,v1=00,v1=${v1("whsec_new")}`, body, 1000), true);
    assert.equal(verifyWebhookSignature("whsec_new", "t=1000,v1=00,v1=11", body, 1000), false);
});

// Login and token renewal ---------------------------------------------------------

/** A fake Signedly: /ap1/token/, /ap1/refreshtoken/ and /ap1/documents/. */
async function fakeSignedly({ refuseRefresh = false, refuseKeys = false, lifetimeMs = 7200_000 } = {}) {
    const calls = [];
    let issued = 0;
    const answer = () => {
        issued += 1;
        const now = Date.now();
        return {
            access_token: `access-${issued}`,
            refresh_token: "refresh-1",
            expiry_date: new Date(now + lifetimeMs).toISOString(),
            refresh_token_expiry_date: new Date(now + 7 * 86400_000).toISOString(),
            updated_at: new Date(now).toISOString(),
            expired: false,
        };
    };
    const server = createServer((request, response) => {
        let body = "";
        request.on("data", (chunk) => (body += chunk));
        request.on("end", () => {
            const send = (status, data) => {
                response.writeHead(status, { "Content-Type": "application/json" });
                response.end(JSON.stringify(data));
            };
            const path = request.url.split("?")[0];
            calls.push({ path, authorization: request.headers.authorization, body: body && JSON.parse(body) });
            if (path === "/ap1/token/") {
                return refuseKeys ? send(403, { status: "Client not found" }) : send(200, answer());
            }
            if (path === "/ap1/refreshtoken/") {
                return refuseRefresh ? send(403, { status: "Token not found" }) : send(200, answer());
            }
            if (path === "/ap1/documents/") return send(200, { count: 0, results: [] });
            return send(404, { detail: "Not found" });
        });
    });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const basePath = `http://127.0.0.1:${server.address().port}`;
    return { basePath, calls, close: () => new Promise((resolve) => server.close(resolve)) };
}

const paths = (calls) => calls.map((call) => call.path);

test("the first call logs in with the keys and sends the token; later calls reuse it", async () => {
    const fake = await fakeSignedly();
    try {
        const documents = new DocumentsApi(signedlyConfiguration("id", "secret", fake.basePath));
        await documents.listDocuments();
        await documents.listDocuments();
        assert.deepEqual(paths(fake.calls), ["/ap1/token/", "/ap1/documents/", "/ap1/documents/"]);
        assert.deepEqual(fake.calls[0].body, { client_id: "id", client_secret: "secret" });
        assert.equal(fake.calls[1].authorization, "Bearer access-1");
        assert.equal(fake.calls[2].authorization, "Bearer access-1");
    } finally {
        await fake.close();
    }
});

test("a token close to expiry is renewed with the refresh token", async () => {
    // Tokens that expire within the 2-minute margin are renewed on every call.
    const fake = await fakeSignedly({ lifetimeMs: 60_000 });
    try {
        const documents = new DocumentsApi(signedlyConfiguration("id", "secret", fake.basePath));
        await documents.listDocuments();
        await documents.listDocuments();
        assert.deepEqual(paths(fake.calls), [
            "/ap1/token/",
            "/ap1/documents/",
            "/ap1/refreshtoken/",
            "/ap1/documents/",
        ]);
        assert.deepEqual(fake.calls[2].body, { refresh_token: "refresh-1" });
        assert.equal(fake.calls[3].authorization, "Bearer access-2");
    } finally {
        await fake.close();
    }
});

test("a refused refresh token falls back to the keys", async () => {
    const fake = await fakeSignedly({ lifetimeMs: 60_000, refuseRefresh: true });
    try {
        const documents = new DocumentsApi(signedlyConfiguration("id", "secret", fake.basePath));
        await documents.listDocuments();
        await documents.listDocuments();
        assert.deepEqual(paths(fake.calls), [
            "/ap1/token/",
            "/ap1/documents/",
            "/ap1/refreshtoken/",
            "/ap1/token/",
            "/ap1/documents/",
        ]);
        assert.equal(fake.calls[4].authorization, "Bearer access-2");
    } finally {
        await fake.close();
    }
});

test("calls made at the same time share one login", async () => {
    const fake = await fakeSignedly();
    try {
        const documents = new DocumentsApi(signedlyConfiguration("id", "secret", fake.basePath));
        await Promise.all([documents.listDocuments(), documents.listDocuments(), documents.listDocuments()]);
        assert.equal(paths(fake.calls).filter((path) => path === "/ap1/token/").length, 1);
    } finally {
        await fake.close();
    }
});

test("refused keys raise a SignedlyAuthError with the server's reason", async () => {
    const fake = await fakeSignedly({ refuseKeys: true });
    try {
        const documents = new DocumentsApi(signedlyConfiguration("id", "wrong", fake.basePath));
        await assert.rejects(documents.listDocuments(), (error) => {
            assert.ok(error instanceof SignedlyAuthError);
            assert.equal(error.status, 403);
            assert.match(error.message, /Signedly refused the API keys: Client not found/);
            return true;
        });
        assert.deepEqual(paths(fake.calls), ["/ap1/token/"]);
    } finally {
        await fake.close();
    }
});
