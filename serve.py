#!/usr/bin/env python3
"""
Local preview server with clean-URL (extensionless) resolution.

It mirrors the production NGINX rule `try_files $uri $uri.html $uri/`,
so a request for /careers is served from careers.html — exactly like the
live site will behave. Use this instead of `python3 -m http.server`.

Run from the repo folder:
    python3 serve.py            # http://localhost:8000/
    python3 serve.py 3000       # custom port
"""
import http.server, os, sys, urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self._resolve_clean_url()
        super().do_GET()

    def do_HEAD(self):
        self._resolve_clean_url()
        super().do_HEAD()

    def _resolve_clean_url(self):
        # split off any ?query (e.g. /post?slug=foo)
        path, sep, query = self.path.partition("?")
        fs = self.translate_path(path)
        # a real file or a directory (index.html) -> leave as-is
        if os.path.exists(fs) or path.endswith("/"):
            return
        # /careers -> careers.html if that file exists
        if os.path.exists(fs + ".html"):
            self.path = path + ".html" + (sep + query if sep else "")


print("Serving %s\n  http://localhost:%d/   (clean URLs enabled — Ctrl+C to stop)" % (ROOT, PORT))
try:
    http.server.HTTPServer(("", PORT), Handler).serve_forever()
except KeyboardInterrupt:
    print("\nstopped")
