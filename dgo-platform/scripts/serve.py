from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
class DGOHandler(SimpleHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'
os.chdir(Path(__file__).resolve().parents[1])
print('DGO Digital Operations: http://localhost:8080/')
ThreadingHTTPServer(('127.0.0.1', 8080), DGOHandler).serve_forever()
