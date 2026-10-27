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

SPEC=openapi/signedly-ap1.json
declare -A GENERATOR=([python]=python [node]=typescript-axios [php]=php [java]=java)
for sdk in "${@:-python node php java}"; do
  for name in $sdk; do
    java -jar "$JAR" generate --input-spec "$SPEC" \
      --generator-name "${GENERATOR[$name]}" \
      --config "config/$name.yaml" \
      --output "$name" \
      --skip-validate-spec \
      --global-property skipFormModel=false > /dev/null
    echo "generated $name"
  done
done
