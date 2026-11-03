## @signedly/sdk

Signedly REST API client for Node.js and TypeScript: send documents for e-signature, track them and verify webhooks. Works with CommonJS and ES modules; TypeScript types are included.

### Installation

```sh
npm install @signedly/sdk
```

### Usage

Generate a client ID and secret in Signedly under **Account & Settings → API** (test keys for the sandbox, live keys for real documents). The helper fetches the access token on the first call and renews it before it expires.

```ts
import { DocumentsApi } from "@signedly/sdk";
import { signedlyConfiguration } from "@signedly/sdk/dist/helpers";

const config = signedlyConfiguration(CLIENT_ID, CLIENT_SECRET);
const { data } = await new DocumentsApi(config).listDocuments();
```

Every endpoint has a method on its API class (`DocumentsApi`, `SignatoriesApi`, `FieldsApi`, `SendingApi`, `DownloadsApi`, `TemplatesApi`, `BulkSendingApi`, `WebhooksApi`, …), named after its operation, e.g. `uploadDocument`, `createSignatory`, `sendDocument`.

Check every webhook event with `verifyWebhookSignature(secret, header, rawBody)` from `@signedly/sdk/dist/helpers`, passing the raw request body.

The whole API (every endpoint, field and status) is documented at https://l0ads.signedly.com/swaggerap1/. The [repository README](https://github.com/signedly/signedly-sdks#readme) covers the usual flow, webhooks and the sandbox.

### License

MIT
