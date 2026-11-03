#!/usr/bin/env bash
# Regenerate every SDK from openapi/signedly-ap1.json (the REST API spec).
# Needs Java 11+. Hand-written files listed in each SDK's .openapi-generator-ignore
# are kept. Usage: scripts/generate.sh [python|node|php|java ...]
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION=7.10.0
SHA1=e9cc6e4cd2dcb77a86b647a1ed4352fd08f187ce
JAR=.cache/openapi-generator-cli-$VERSION.jar
if [ ! -f "$JAR" ]; then
  mkdir -p .cache
  curl -sSfL -o "$JAR" \
    "https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$VERSION/openapi-generator-cli-$VERSION.jar"
fi
echo "$SHA1  $JAR" | sha1sum -c --quiet -

# The committed spec stays exactly what production serves (spec-check.yml compares
# them); the packages' author and license, multipart for uploads and answers without
# length limits are set in a copy here.
SPEC=.cache/signedly-ap1.json
python3 - openapi/signedly-ap1.json "$SPEC" <<'PY'
import json, sys
spec = json.load(open(sys.argv[1]))
spec["info"]["contact"] = {"name": "Signedly", "email": "support@signedly.com", "url": "https://signedly.com"}
spec["info"]["license"] = {"name": "MIT", "url": "https://opensource.org/license/mit"}
# An operation that takes a file is sent as multipart/form-data: the generators
# use the first type it lists, and url-encoded (listed first) can't carry a file.
for path in spec["paths"].values():
    for operation in path.values():
        if isinstance(operation, dict) and any(
            p.get("type") == "file" for p in operation.get("parameters", [])
        ):
            operation["consumes"] = ["multipart/form-data"]
# Definitions describe answers (request bodies are inline). Their length and range
# limits come from the request serializers, and stored data can break them (an
# unsent document's subject is ""): a client must read what the API returns.
def drop_limits(schema):
    if isinstance(schema, dict):
        for key in ("minLength", "maxLength", "minimum", "maximum", "pattern"):
            schema.pop(key, None)
        for value in schema.values():
            drop_limits(value)
    elif isinstance(schema, list):
        for value in schema:
            drop_limits(value)
drop_limits(spec["definitions"])
json.dump(spec, open(sys.argv[2], "w"), indent=2)
PY

declare -A GENERATOR=([python]=python [node]=typescript-axios [php]=php [java]=java)
for sdk in "${@:-python node php java}"; do
  for name in $sdk; do
    templates=()
    [ -d "config/templates/$name" ] && templates=(--template-dir "config/templates/$name")
    java -jar "$JAR" generate --input-spec "$SPEC" \
      --generator-name "${GENERATOR[$name]}" \
      --config "config/$name.yaml" \
      "${templates[@]}" \
      --output "$name" \
      --skip-validate-spec \
      --global-property skipFormModel=false > /dev/null
    echo "generated $name"
  done
done
