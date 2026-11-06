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
| PHP 8.0+ | `composer require signedly/sdk` (Guzzle 7) |
| Java 11+ | Maven `com.signedly:signedly-sdk` (Gradle: `implementation "com.signedly:signedly-sdk:0.1.1"`) |

Java with Maven:

```xml
<dependency>
  <groupId>com.signedly</groupId>
  <artifactId>signedly-sdk</artifactId>
  <version>0.1.1</version>
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
  `package.json` (author, description, `files`), Java's `pom.xml` (the Maven
  Central publishing plugin) and Java's `api.mustache` (multipart uploads skip
  optional fields left null, give the file's type from its name, and are sent with
  their length, not chunked). They are copies of openapi-generator 7.10.0's own
  templates, so re-copy them when the generator version changes.
- **Dev and build dependencies** are set in the template overrides too, because
  regenerating writes the manifests: `node/package.json` and `node/tsconfig.json`,
  `python/pyproject.toml` and `python/test-requirements.txt` (those need Python
  3.11+), `php/composer.json` and `java/pom.xml`. Change the template, then run
  `scripts/generate.sh`.
- **Runtime dependencies** keep the generator's wide ranges, so customers choose
  their own versions. `java/pom.xml` lists exact versions, as Maven does; customers
  can override them. The root `composer.json` `require` follows `php/composer.json`.
- **Kept back on purpose:**
  - openapi-generator stays on 7.10.0. Newer versions rewrite the generated code in
    every SDK and raise the runtime minimums (for example pydantic 2.11, axios 1.18,
    PHP 8.1).
  - TypeScript stays on 6: `tsc` 6 with `node/tsconfig.json` builds the same `dist/`
    as 5.9, and TypeScript 7 writes typings (`globalAxios.AxiosResponse`) that don't
    compile in customers' projects.
  - JUnit stays on 5, which still runs on Java 11; JUnit 6 needs Java 17.
  - Guzzle 8 is not in the PHP range: the generated code calls
    `GuzzleHttp\Utils::jsonEncode`, which Guzzle 8 removed.
- **Author and license:** `scripts/generate.sh` adds Signedly's contact
  (`support@signedly.com`) and the MIT license to a copy of the spec, so the committed
  spec stays exactly what production serves.
- **PHP on Packagist:** Packagist reads the root `composer.json`, which loads
  `php/lib/`. Its `require` must match `php/composer.json` (CI checks), and
  `.gitattributes` leaves the other languages out of PHP installs.

**CI** (`.github/workflows/`):
- `sdks.yml`, on every PR:
  - regenerating must change nothing (drift);
  - each SDK builds, and its helper tests run, on the oldest and the newest runtime
    (Python 3.8 and 3.14, Node 20 and 26, PHP 8.0 and 8.5, Java 11 and 25);
  - each SDK logs in through its helper against a fake Signedly and must send the
    token (`scripts/fake_signedly.py`; Java's `LoginTest`).
- `spec-check.yml`, weekly and by hand: fails when production serves a different spec than the committed one. That means a backend release changed the API, so update the spec and publish new versions.

## Publishing

Publishing needs Signedly's registry accounts and is done by a person. Every
registry keeps a published version for good (PyPI and Maven Central never take the
same version again), so publish only from an up-to-date `integration` with CI green.
Each SDK has its own version (`config/<language>.yaml`): release only the ones
that changed. Packagist takes the PHP version from the git tag `vX.Y.Z`.

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

1. Bump the version of each SDK that changed in its `config/<language>.yaml` (for
   Java, also in the install lines of this README), run `scripts/generate.sh`, and
   merge that PR.
2. From `integration`, for the SDKs you bumped:
   ```bash
   # PyPI
   cd python && python -m pip install --upgrade build twine && python -m build \
     && twine check dist/* && TWINE_USERNAME=__token__ twine upload dist/* && cd ..
   # npm (builds first, then asks for the two-factor code)
   cd node && npm install && npm publish --access public && cd ..
   # Packagist reads the tag
   git tag vX.Y.Z && git push origin vX.Y.Z
   # Maven Central: give GPG the passphrase in the terminal first, or signing
   # times out waiting for a pop-up
   export GPG_TTY=$(tty)
   echo test | gpg --pinentry-mode loopback --clearsign > /dev/null
   cd java && mvn -P sign-artifacts -DskipTests deploy && cd ..
   ```
3. Maven Central: in Deployments on central.sonatype.com, wait for "Validated" and
   click **Publish**.
4. Check each in a clean place: `pip install signedly`, `npm view @signedly/sdk`,
   `composer require signedly/sdk`, and the artifact page
   https://central.sonatype.com/artifact/com.signedly/signedly-sdk.

## License

MIT, see `LICENSE`.
