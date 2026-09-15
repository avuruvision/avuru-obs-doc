#!/usr/bin/env python3
"""Send a synthetic checkout trace and correlated log to an OTLP/HTTP receiver.

Standard library only. No checkout or database query is executed.
Use a test project; this script writes a small, explicitly named example dataset.
"""
import argparse
import json
import os
import secrets
import time
import urllib.error
import urllib.request


def attribute(key, value):
    return {"key": key, "value": {"stringValue": value}}


def dataset():
    trace_id = secrets.token_hex(16)
    ids = [secrets.token_hex(8) for _ in range(4)]
    start = time.time_ns() - 5_000_000_000

    def span(name, span_id, parent, kind, offset, duration, extra=()):
        result = {
            "traceId": trace_id, "spanId": span_id, "name": name, "kind": kind,
            "startTimeUnixNano": str(start + offset * 1_000_000),
            "endTimeUnixNano": str(start + (offset + duration) * 1_000_000),
            "attributes": [attribute("example.source", "avuru-docs-slow-checkout"), *extra],
            "status": {"code": 1},
        }
        if parent:
            result["parentSpanId"] = parent
        return result

    def resource(service):
        return {"attributes": [attribute("service.name", service)]}

    traces = {"resourceSpans": [
        {"resource": resource("atlas-checkout"), "scopeSpans": [{"spans": [
            span("POST /checkout", ids[0], None, 2, 0, 842),
            span("POST /authorize", ids[1], ids[0], 3, 20, 790,
                 [attribute("server.address", "atlas-payment"), attribute("http.request.method", "POST")]),
        ]}]},
        {"resource": resource("atlas-payment"), "scopeSpans": [{"spans": [
            span("POST /authorize", ids[2], ids[1], 2, 30, 770),
            span("SELECT orders", ids[3], ids[2], 3, 60, 710,
                 [attribute("db.system", "postgresql"), attribute("db.system.name", "postgresql"),
                  attribute("server.address", "atlas-orders-db"), attribute("db.namespace", "shop")]),
        ]}]},
    ]}
    logs = {"resourceLogs": [{"resource": resource("atlas-payment"), "scopeLogs": [{"logRecords": [{
        "timeUnixNano": str(start + 775_000_000), "traceId": trace_id, "spanId": ids[2],
        "severityNumber": 13, "severityText": "WARN",
        "body": {"stringValue": "Synthetic checkout example: database span accounts for most of the request duration."},
        "attributes": [attribute("example.source", "avuru-docs-slow-checkout")],
    }]}]}]}
    return trace_id, traces, logs


def export(endpoint, signal, payload, key):
    headers = {"Content-Type": "application/json"}
    if key:
        headers["Authorization"] = f"Bearer {key}"
    request = urllib.request.Request(
        endpoint.rstrip("/") + f"/v1/{signal}",
        data=json.dumps(payload).encode(), headers=headers, method="POST",
    )
    with urllib.request.urlopen(request, timeout=15) as response:
        body = response.read()
        result = json.loads(body) if body else {}
        partial = result.get("partialSuccess", {})
        if any(int(partial.get(k, 0)) for k in ("rejectedSpans", "rejectedLogRecords")):
            raise RuntimeError(f"Receiver rejected part of the {signal} dataset")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--endpoint", default="http://127.0.0.1:4318")
    parser.add_argument("--dry-run", action="store_true", help="Print the dataset without sending it")
    args = parser.parse_args()
    trace_id, traces, logs = dataset()
    if args.dry_run:
        print(json.dumps({"traceId": trace_id, "traces": traces, "logs": logs}, indent=2))
        return
    key = os.environ.get("AVURU_INGEST_KEY", "")
    export(args.endpoint, "traces", traces, key)
    export(args.endpoint, "logs", logs, key)
    print(f"Sent synthetic trace {trace_id} (4 spans) and 1 correlated log.")
    print("In Avuru Obs: choose your test project, last 15 minutes, service atlas-checkout.")


if __name__ == "__main__":
    main()
