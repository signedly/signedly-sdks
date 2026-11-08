"""A fake Signedly for CI: /ap1/token/ and /ap1/refreshtoken/ hand out "tok-1"; every GET answers an empty
page with "Authorization: Bearer tok-1" and 403 without it; POST /ap1/upload/ answers
200 only for multipart/form-data with a PDF in its "file" part, sent with its length
(400 otherwise, as the real API does: it reads no body from a chunked request). Usage:
    python3 scripts/fake_signedly.py 8765 &
Each SDK job then logs in through its helper, lists documents and uploads a PDF
(sdks.yml)."""

import email
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

    def body(self):
        """The body as the real API sees it: empty when sent chunked (no length)."""
        if self.headers.get("Transfer-Encoding", "").lower() != "chunked":
            return self.rfile.read(int(self.headers.get("Content-Length") or 0))
        while True:
            size = int(self.rfile.readline().split(b";")[0], 16)
            self.rfile.read(size)
            self.rfile.readline()
            if size == 0:
                return b""

    def uploaded_file(self, body):
        """The "file" part's bytes, or None unless the body is multipart."""
        kind = self.headers.get("Content-Type", "")
        if not kind.startswith("multipart/form-data"):
            return None
        message = email.message_from_bytes(
            b"Content-Type: " + kind.encode() + b"\r\n\r\n" + body
        )
        for part in message.get_payload():
            if part.get_param("name", header="content-disposition") == "file":
                return part.get_payload(decode=True)
        return None

    def do_POST(self):
        body = self.body()
        print(f"POST {self.path} Content-Type={self.headers.get('Content-Type')!r}", flush=True)
        if self.path.startswith(("/ap1/token/", "/ap1/refreshtoken/")):
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
        if self.path.startswith("/ap1/upload/"):
            if self.headers.get("Authorization") != "Bearer tok-1":
                return self.answer(403, {"detail": "Client not found"})
            data = self.uploaded_file(body)
            if not data or not data.startswith(b"%PDF"):
                message = "The submitted data was not a file. Check the encoding type on the form."
                return self.answer(400, {"file": [message]})
            now = datetime.now(timezone.utc).isoformat()
            return self.answer(
                200,
                {
                    "id": "00000000-0000-0000-0000-000000000001",
                    "name": "fake",
                    "type": 2,
                    "status": 2,
                    "mimetype": "application/pdf",
                    "is_test": True,
                    "created_at": now,
                    "updated_at": now,
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
