/**
 * Hand-written helpers, kept when the SDK is regenerated (.openapi-generator-ignore).
 *
 *   import { DocumentsApi } from "@signedly/sdk";
 *   import { signedlyConfiguration, verifyWebhookSignature } from "@signedly/sdk/dist/helpers";
 *
 *   const config = signedlyConfiguration(CLIENT_ID, CLIENT_SECRET); // test keys work the same
 *   const documents = await new DocumentsApi(config).listDocuments();
 *
 * The access token is fetched on the first call and renewed (refresh token, then
 * the keys again) shortly before it expires.
 */
import { createHmac, timingSafeEqual } from "crypto";
import { AuthenticationApi } from "./api";
import { Configuration } from "./configuration";

export const LIVE_HOST = "https://l0ads.signedly.com";

/** Thrown when Signedly refuses the client ID and secret (wrong, rotated or no
 * API access); `status` is the HTTP status. */
export class SignedlyAuthError extends Error {
    constructor(message: string, public status?: number, public cause?: unknown) {
        super(message);
        this.name = "SignedlyAuthError";
    }
}

type TokenAnswer = {
    access_token?: string;
    refresh_token?: string;
    expiry_date?: string;
    refresh_token_expiry_date?: string;
};
const RENEW_BEFORE_MS = 120_000;
const SIGNATURE_TOLERANCE_S = 300;

export function signedlyConfiguration(
    clientId: string,
    clientSecret: string,
    basePath: string = LIVE_HOST,
): Configuration {
    const auth = new AuthenticationApi(new Configuration({ basePath }));
    let access = "";
    let refresh = "";
    let expires = 0;
    let refreshExpires = 0;
    let pending: Promise<void> | null = null;

    async function renew(): Promise<void> {
        const now = Date.now();
        let data: TokenAnswer | undefined;
        if (refresh && now < refreshExpires - RENEW_BEFORE_MS) {
            try {
                ({ data } = await auth.refreshAccessToken({ refresh_token: refresh }));
            } catch {
                // A refused refresh token (signed out, or replaced) isn't fatal:
                // log in again with the keys.
                refresh = "";
            }
        }
        if (!data) {
            try {
                ({ data } = await auth.getAccessToken({ client_id: clientId, client_secret: clientSecret }));
            } catch (error: any) {
                const answer = error?.response?.data;
                const why = answer?.status ?? answer?.detail ?? error?.message ?? "no answer";
                throw new SignedlyAuthError(`Signedly refused the API keys: ${why}`, error?.response?.status, error);
            }
        }
        access = data.access_token ?? "";
        refresh = data.refresh_token ?? refresh;
        expires = data.expiry_date ? Date.parse(data.expiry_date) : 0;
        if (data.refresh_token_expiry_date) refreshExpires = Date.parse(data.refresh_token_expiry_date);
    }

    return new Configuration({
        basePath,
        apiKey: async () => {
            if (Date.now() >= expires - RENEW_BEFORE_MS) {
                pending = pending ?? renew().finally(() => (pending = null));
                await pending;
            }
            return `Bearer ${access}`;
        },
    });
}

/** True if `Signedly-Signature` signs this raw body with the endpoint's secret,
 * made within 5 minutes. Pass the body exactly as received. With several `v1`
 * values (a secret rotation), any of them may match. */
export function verifyWebhookSignature(
    secret: string,
    signatureHeader: string,
    rawBody: string | Buffer,
    nowSeconds: number = Date.now() / 1000,
): boolean {
    // During a secret rotation the header carries one v1 per secret
    // (t=…,v1=<new>,v1=<old>): any of them may match.
    let t: string | undefined;
    const signatures: string[] = [];
    for (const item of (signatureHeader || "").split(",")) {
        const at = item.indexOf("=");
        if (at <= 0) continue;
        const key = item.slice(0, at);
        const value = item.slice(at + 1);
        if (key === "t") t = value;
        else if (key === "v1" && value) signatures.push(value);
    }
    const timestamp = Number(t);
    if (!signatures.length || t === undefined || !Number.isInteger(timestamp)) return false;
    if (Math.abs(nowSeconds - timestamp) > SIGNATURE_TOLERANCE_S) return false;
    const expected = Buffer.from(
        createHmac("sha256", secret).update(`${timestamp}.${rawBody.toString()}`).digest("hex"),
    );
    return signatures.some((signature) => {
        const given = Buffer.from(signature);
        return given.length === expected.length && timingSafeEqual(given, expected);
    });
}
