#!/usr/bin/env bash
# The /ap1/ spec a backend checkout would serve, built without a server or database.
#
#   scripts/spec-from-backend.sh <backend checkout>          # replace openapi/signedly-ap1.json, regenerate
#   scripts/spec-from-backend.sh <backend checkout> --check  # exit 1 if it differs from the committed spec
#
# Runs the backend's own ApiSchemaGenerator (what /swaggerap1/ serves) with the
# backend's Python (BACKEND_PYTHON, default: python3, with the backend's
# requirements installed). The keys below are throwaway values that only let the
# settings load; nothing is encrypted or sent.
set -euo pipefail
cd "$(dirname "$0")/.."
BACKEND=$(cd "${1:?usage: scripts/spec-from-backend.sh <backend checkout> [--check]}" && pwd)
MODE=${2:-}
OUT=$(mktemp)
trap 'rm -f "$OUT"' EXIT
FERNET=eLc95IxbZu01-PdE67bwT-FrRPP-lv-MX3tqb2pBxzQ=
(
  cd "$BACKEND"
  env -i PATH="$PATH" HOME="${HOME:-/tmp}" \
    SECRET_KEY=spec-only \
    STRIPE_KEY_ENCRYPTION_KEY=$FERNET \
    API_CREDENTIALS_ENCRYPTION_KEY=$FERNET \
    API_CREDENTIALS_LOOKUP_KEY=spec-only-lookup-key-not-a-secret-0123 \
    SPEC_OUT="$OUT" \
    "${BACKEND_PYTHON:-python3}" manage.py shell -c '
import json, os
from drf_yasg.codecs import OpenAPICodecJson
from backend.urls import API_INFO, API_PATTERNS, ApiSchemaGenerator
spec = ApiSchemaGenerator(API_INFO, patterns=API_PATTERNS).get_schema(public=True)
spec = json.loads(OpenAPICodecJson(validators=[]).encode(spec))
spec.update(host="l0ads.signedly.com", basePath="/", schemes=["https"])
with open(os.environ["SPEC_OUT"], "w") as out:
    json.dump(spec, out, indent=2, sort_keys=True)
    out.write("\n")
'
)
if [ "$MODE" = "--check" ]; then
  if cmp -s "$OUT" openapi/signedly-ap1.json; then
    echo "The committed spec matches the backend checkout."
    exit 0
  fi
  echo "The backend checkout serves a different spec: run scripts/spec-from-backend.sh <backend> and open a PR."
  diff <(python3 -m json.tool --sort-keys openapi/signedly-ap1.json) <(python3 -m json.tool --sort-keys "$OUT") | head -200 || true
  exit 1
fi
cp "$OUT" openapi/signedly-ap1.json
scripts/generate.sh
