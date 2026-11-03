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
| `php/` | `signedly/sdk` (Packagist, from the root `composer.json`) | `php` |
| `java/` | `com.signedly:signedly-sdk` (Maven Central) | `java`, `native` library (Java 11+) |

## Install

| Language | Install |
|---|---|
| Python 3.8+ | `pip install signedly` |
| Node / TypeScript | `npm install @signedly/sdk` |
| PHP 7.4+ | `composer require signedly/sdk` |
| Java 11+ | Maven `com.signedly:signedly-sdk` (Gradle: `implementation "com.signedly:signedly-sdk:0.1.0"`) |

Java with Maven:

```xml
<dependency>
  <groupId>com.signedly</groupId>
  <artifactId>signedly-sdk</artifactId>
  <version>0.1.0</version>
</dependency>
```

## Quick start

Generate a client ID and secret in Signedly under **Account & Settings → API**
(test keys for the sandbox, live keys for real documents).

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
- **Generator settings** are in `config/<language>.yaml` (package names, versions,
  author, links and license).
- **Template overrides** are in `config/templates/<language>/`: every SDK's
  `README.md` (install from the registry, log in with the helper), Node's
  `package.json` (author, description, `files`) and Java's `pom.xml` (the Maven
  Central publishing plugin). They are copies of openapi-generator 7.10.0's own
  templates, so re-copy them when the generator version changes.
- **Author and license:** `scripts/generate.sh` adds Signedly's contact
  (`info@signedly.com`) and the MIT license to a copy of the spec, so the committed
  spec stays exactly what production serves.
- **PHP on Packagist:** Packagist reads the root `composer.json`, which loads
  `php/lib/`. Its `require` must match `php/composer.json` (CI checks), and
  `.gitattributes` leaves the other languages out of PHP installs.

**CI** (`.github/workflows/`):
- `sdks.yml`, on every PR:
  - regenerating must change nothing (drift);
  - each SDK builds, and its helper tests run.
- `spec-check.yml`, weekly and by hand: fails when production serves a different spec than the committed one. That means a backend release changed the API, so update the spec and publish new versions.

## Publishing

Publishing needs Signedly's registry accounts and is done by a person. Every
registry keeps a published version for good (PyPI and Maven Central never take the
same version again), so publish only from an up-to-date `integration` with CI green.
All four packages share one version.

### Accounts (once)

Use the username `signedly` on each, keep logins and recovery codes in the team
password manager, and add a second owner.

- **PyPI** (https://pypi.org): turn on two-factor authentication. For the first
  upload make an API token scoped to the entire account; afterwards replace it with
  one scoped to the `signedly` project.
- **npm** (https://www.npmjs.com): turn on two-factor authentication for
  authorization and writes, and create the free organisation `signedly`.
- **Packagist** (https://packagist.org): sign in with GitHub as an admin of the
  `signedly` org, **Submit** `https://github.com/signedly/signedly-sdks`. If the
  package page says it isn't updated automatically, add a GitHub webhook to
  `https://packagist.org/api/github?username=<packagist username>` (JSON, push
  events, secret = the Packagist API token).
- **Maven Central** (https://central.sonatype.com): sign up with email, add the
  namespace `com.signedly` and verify it with the TXT record it shows (signedly.com's
  DNS is at GoDaddy). Generate a user token and put it in `~/.m2/settings.xml`:
  ```xml
  <settings><servers><server>
    <id>central</id><username>TOKEN_USERNAME</username><password>TOKEN_PASSWORD</password>
  </server></servers></settings>
  ```
  Make a GPG key (`gpg --full-generate-key`, RSA 4096) and send its public half to
  `keyserver.ubuntu.com` and `keys.openpgp.org` (`gpg --keyserver <server> --send-keys <KEYID>`).

### Each release

1. Bump the version in every `config/<language>.yaml` and in the Java install
   lines of this README, run `scripts/generate.sh`, and merge that PR.
2. From `integration`:
   ```bash
   # PyPI
   cd python && python -m pip install --upgrade build twine && python -m build \
     && twine check dist/* && TWINE_USERNAME=__token__ twine upload dist/* && cd ..
   # npm (builds first, then asks for the two-factor code)
   cd node && npm install && npm publish --access public && cd ..
   # Packagist reads the tag
   git tag vX.Y.Z && git push origin vX.Y.Z
   # Maven Central (asks for the GPG passphrase)
   cd java && mvn -P sign-artifacts deploy && cd ..
   ```
3. Maven Central: in Deployments on central.sonatype.com, wait for "Validated" and
   click **Publish**.
4. Check each in a clean place: `pip install signedly`, `npm view @signedly/sdk`,
   `composer require signedly/sdk`, and the artifact page
   https://central.sonatype.com/artifact/com.signedly/signedly-sdk.

## License

MIT, see `LICENSE`.
