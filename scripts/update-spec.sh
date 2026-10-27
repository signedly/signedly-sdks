#!/usr/bin/env bash
# Replace openapi/signedly-ap1.json with the spec a Signedly backend serves, then
# regenerate. Usage: scripts/update-spec.sh [base URL]   (default: production)
set -euo pipefail
cd "$(dirname "$0")/.."
BASE=${1:-https://l0ads.signedly.com}
curl -sSf "$BASE/swaggerap1/?format=openapi" | python3 -c '
import json, sys
spec = json.load(sys.stdin)
spec.update(host="l0ads.signedly.com", basePath="/", schemes=["https"])
json.dump(spec, sys.stdout, indent=2, sort_keys=True)
print()' > openapi/signedly-ap1.json
scripts/generate.sh
