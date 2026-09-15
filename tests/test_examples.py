"""Contract checks for the downloadable synthetic OTLP exercise (no live backend)."""
import importlib.util
import json
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer
import threading
import unittest

spec = importlib.util.spec_from_file_location("checkout", Path(__file__).parents[1] / "static/examples/slow-checkout.py")
checkout = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checkout)


class CheckoutExercise(unittest.TestCase):
    def test_trace_and_log_share_valid_context_and_nested_durations(self):
        trace_id, traces, logs = checkout.dataset()
        self.assertEqual(len(trace_id), 32)
        spans = [span for resource in traces["resourceSpans"] for scope in resource["scopeSpans"] for span in scope["spans"]]
        self.assertEqual(len(spans), 4)
        self.assertEqual(len({span["spanId"] for span in spans}), 4)
        self.assertTrue(all(span["traceId"] == trace_id for span in spans))
        by_id = {span["spanId"]: span for span in spans}
        for span in spans:
            start, end = int(span["startTimeUnixNano"]), int(span["endTimeUnixNano"])
            self.assertLess(start, end)
            if "parentSpanId" in span:
                parent = by_id[span["parentSpanId"]]
                self.assertGreaterEqual(start, int(parent["startTimeUnixNano"]))
                self.assertLessEqual(end, int(parent["endTimeUnixNano"]))
        record = logs["resourceLogs"][0]["scopeLogs"][0]["logRecords"][0]
        self.assertEqual(record["traceId"], trace_id)
        self.assertIn(record["spanId"], by_id)
        self.assertEqual(int(spans[0]["endTimeUnixNano"]) - int(spans[0]["startTimeUnixNano"]), 842_000_000)
        self.assertEqual(int(spans[3]["endTimeUnixNano"]) - int(spans[3]["startTimeUnixNano"]), 710_000_000)

    def test_otlp_export_paths_authentication_and_rejected_records(self):
        received = []

        class Receiver(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass

            def do_POST(self):
                payload = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
                received.append((self.path, self.headers["Authorization"], payload))
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b'{"partialSuccess":{"rejectedLogRecords":"1"}}' if self.path.endswith("/logs") else b'{}')

        server = HTTPServer(("127.0.0.1", 0), Receiver)
        thread = threading.Thread(target=server.serve_forever)
        thread.start()
        try:
            endpoint = f"http://127.0.0.1:{server.server_port}"
            _, traces, logs = checkout.dataset()
            checkout.export(endpoint, "traces", traces, "test-key")
            with self.assertRaisesRegex(RuntimeError, "rejected part"):
                checkout.export(endpoint, "logs", logs, "test-key")
            self.assertEqual([record[0] for record in received], ["/v1/traces", "/v1/logs"])
            self.assertTrue(all(record[1] == "Bearer test-key" for record in received))
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
