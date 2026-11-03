"""A fake Signedly for CI: /ap1/token/ hands out "tok-1", and every GET answers an
empty page with "Authorization: Bearer tok-1" and 403 without it. Usage:
    python3 scripts/fake_signedly.py 8765 &
Each SDK job then logs in through its helper and lists documents (sdks.yml)."""

import json
import sys
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    def answer(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass

    def do_POST(self):
        self.rfile.read(int(self.headers.get("Content-Length") or 0))
        print(f"POST {self.path}", flush=True)
        if self.path.startswith("/ap1/token/"):
            now = datetime.now(timezone.utc)
            return self.answer(
                200,
                {
                    "access_token": "tok-1",
                    "refresh_token": "ref-1",
                    "expired": False,
                    "expiry_date": (now + timedelta(hours=2)).isoformat(),
                    "refresh_token_expiry_date": (now + timedelta(days=7)).isoformat(),
                    "updated_at": now.isoformat(),
                },
            )
        self.answer(404, {"detail": "Not found."})

    def do_GET(self):
        auth = self.headers.get("Authorization")
        print(f"GET {self.path} Authorization={auth!r}", flush=True)
        if auth != "Bearer tok-1":
            return self.answer(403, {"detail": "Client not found"})
        self.answer(200, {"count": 0, "next": None, "previous": None, "results": []})


HTTPServer(("0.0.0.0", int(sys.argv[1])), Handler).serve_forever()
