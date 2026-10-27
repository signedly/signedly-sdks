# Signedly SDKs

Client libraries for the Signedly REST API (`/ap1/`) in **Python, Node/TypeScript,
PHP and Java**. Each is generated from the API's OpenAPI spec
(`openapi/signedly-ap1.json`) with [openapi-generator](https://openapi-generator.tech)
7.10.0, plus a few hand-written helpers:

- **Log in and stay logged in:** give the client ID and secret, and the access token is fetched
  on the first call and renewed (refresh token, then the keys again) before it
  expires.
- **Check webhook signatures:** `Signedly-Signature` against the endpoint's secret,
  refused when older than 5 minutes.
- **Sandbox:** test keys work exactly like live ones; what they make is a
  watermarked, unbilled test document.

The API itself (every endpoint, field and status) is documented at
`https://l0ads.signedly.com/swaggerap1/`. Each SDK's own README lists its classes
and methods.

| Folder | Package | Generator |
|---|---|---|
| `python/` | `signedly` (PyPI) | `python` |
| `node/` | `@signedly/sdk` (npm) | `typescript-axios` |
| `php/` | `signedly/sdk` (Packagist) | `php` |
| `java/` | `com.signedly:signedly-sdk` (Maven Central) | `java`, `native` library (Java 11+) |

## Quick start

Until the packages are published, install from this repository (the folder of
your language).

**Python**

```python
from signedly.helpers import SignedlyClient
from signedly.api.documents_api import DocumentsApi

client = SignedlyClient(CLIENT_ID, CLIENT_SECRET)
for document in DocumentsApi(client.api_client).list_documents().results:
    print(document.id, document.status)
```

**Node / TypeScript**

```ts
import { DocumentsApi } from "@signedly/sdk";
import { signedlyConfiguration } from "@signedly/sdk/dist/helpers";

const config = signedlyConfiguration(CLIENT_ID, CLIENT_SECRET);
const { data } = await new DocumentsApi(config).listDocuments();
```

**PHP**

```php
$auth = new \Signedly\Helpers\SignedlyAuth($clientId, $clientSecret);
$documents = (new \Signedly\Api\DocumentsApi(null, $auth->config()))->listDocuments();
```

Call `$auth->config()` again in long-running jobs, so the token is renewed.

**Java**

```java
ApiClient client = SignedlyAuth.client(clientId, clientSecret);
DocumentPage page = new DocumentsApi(client).listDocuments(null, null, null, null, null);
```

The usual flow is: upload, add signatories, place fields, send, then follow the
document by webhook or by polling. See "Sending a document for signing" in the
API docs. Every SDK has a method per endpoint, named after its operation, e.g.
`upload_document`, `create_signatory`, `create_document_fields`, `send_document`,
`get_download_link`, `create_bulk_send`, `create_webhook_endpoint`.

## Webhooks

Check every event before trusting it. Pass the **raw** request body:

| Language | Call |
|---|---|
| Python | `signedly.helpers.verify_webhook_signature(secret, header, raw_body)` |
| Node | `verifyWebhookSignature(secret, header, rawBody)` from `@signedly/sdk/dist/helpers` |
| PHP | `\Signedly\Helpers\Webhook::verifySignature($secret, $header, $rawBody)` |
| Java | `com.signedly.helpers.Webhook.verifySignature(secret, header, rawBody)` |

## Sandbox

Generate test keys in Account & Settings → API and pass them instead of the live
ones. Documents made with them carry "TEST – NOT LEGALLY BINDING" on every page,
their emails start with `[TEST]`, they aren't billed, and an organisation can make
50 a month.

## Changing the SDKs

- **Generated code is never edited by hand.** Change the API (its docs live in
  the backend repo, `backend/api/schema/`), then:
  ```bash
  scripts/update-spec.sh                       # production's spec, then regenerate
  scripts/update-spec.sh http://localhost:8000 # or a local backend's
  scripts/generate.sh                          # regenerate from the committed spec only
  ```
  The script downloads the pinned generator (checksum checked) into `.cache/`.
  It needs Java 11+.
- **Hand-written files** are listed in each SDK's `.openapi-generator-ignore`, so
  regenerating keeps them:
  - `python/signedly/helpers.py`
  - `node/helpers.ts`
  - `php/lib/Helpers/`
  - `java/src/main/java/com/signedly/helpers/`
  - their tests.
- **Generator settings** are in `config/<language>.yaml` (package names and versions).

**CI** (`.github/workflows/`):
- `sdks.yml`, on every PR:
  - regenerating must change nothing (drift);
  - each SDK builds, and its helper tests run.
- `spec-check.yml`, weekly and by hand: fails when production serves a different spec than the committed one. That means a backend release changed the API, so update the spec and publish new versions.

## Publishing

Publishing needs Signedly's registry accounts and is done by a person:

1. Bump the version in every `config/<language>.yaml`, then run `scripts/generate.sh`.
2. Publish each package:
   - **PyPI:** `cd python && python -m build && twine upload dist/*`
   - **npm:** `cd node && npm publish --access public`
   - **Packagist:** tag the repository (`git tag v0.x.y`), and Packagist reads `php/composer.json`. The package must be registered once, pointing at this repository.
   - **Maven Central:** `cd java && mvn deploy`, with the Sonatype account and a GPG key in `~/.m2/settings.xml`.
