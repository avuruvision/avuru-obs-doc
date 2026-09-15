package main

import (
	"bytes"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"strings"
	"testing"
	"time"

	collectortrace "go.opentelemetry.io/proto/otlp/collector/trace/v1"
	"google.golang.org/protobuf/proto"
)

func TestExampleProcess(t *testing.T) {
	if os.Getenv("AVURU_EXAMPLE_TEST_CHILD") != "1" {
		return
	}
	if err := run(); err != nil {
		t.Fatal(err)
	}
	os.Exit(0)
}

func TestRequestPropagationAndShutdownExport(t *testing.T) {
	exports := make(chan *collectortrace.ExportTraceServiceRequest, 4)
	receiver := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/v1/traces" || r.Header.Get("Authorization") != "Bearer test-key" {
			t.Errorf("unexpected export path or authentication")
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		body, err := io.ReadAll(r.Body)
		if err != nil {
			t.Error(err)
			return
		}
		request := &collectortrace.ExportTraceServiceRequest{}
		if err := proto.Unmarshal(body, request); err != nil {
			t.Error(err)
			return
		}
		exports <- request
		w.Header().Set("Content-Type", "application/x-protobuf")
		w.WriteHeader(http.StatusOK)
	}))
	defer receiver.Close()

	child := exec.Command(os.Args[0], "-test.run=^TestExampleProcess$")
	child.Env = append(os.Environ(), "AVURU_EXAMPLE_TEST_CHILD=1",
		"OTEL_SERVICE_NAME=avuru-go-example", "OTEL_EXPORTER_OTLP_TRACES_ENDPOINT="+receiver.URL+"/v1/traces",
		"OTEL_EXPORTER_OTLP_TRACES_HEADERS=Authorization=Bearer test-key")
	var output bytes.Buffer
	child.Stdout, child.Stderr = &output, &output
	if err := child.Start(); err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { _ = child.Process.Kill() })

	client := &http.Client{Timeout: time.Second}
	const traceID = "0123456789abcdef0123456789abcdef"
	deadline := time.Now().Add(10 * time.Second)
	ready := false
	for time.Now().Before(deadline) {
		request, _ := http.NewRequest(http.MethodGet, "http://127.0.0.1:8081/hello", nil)
		request.Header.Set("traceparent", "00-"+traceID+"-0123456789abcdef-01")
		response, err := client.Do(request)
		if err == nil {
			body, _ := io.ReadAll(response.Body)
			_ = response.Body.Close()
			if response.StatusCode == http.StatusOK && strings.Contains(string(body), "hello from avuru-go-example") {
				ready = true
				break
			}
		}
		time.Sleep(25 * time.Millisecond)
	}
	if !ready {
		t.Fatal("example did not become ready on its documented port")
	}
	if err := child.Process.Signal(os.Interrupt); err != nil {
		t.Fatal(err)
	}
	done := make(chan error, 1)
	go func() { done <- child.Wait() }()
	select {
	case err := <-done:
		if err != nil {
			t.Fatalf("shutdown failed: %v\n%s", err, output.String())
		}
	case <-time.After(15 * time.Second):
		t.Fatal("shutdown did not finish")
	}
	if !strings.Contains(output.String(), `"trace_id":"`+traceID+`"`) {
		t.Fatalf("stdout log lost the incoming trace identity: %s", output.String())
	}
	select {
	case exported := <-exports:
		if len(exported.ResourceSpans) != 1 || len(exported.ResourceSpans[0].ScopeSpans) != 1 {
			t.Fatalf("unexpected OTLP resource structure: %v", exported)
		}
		spans := exported.ResourceSpans[0].ScopeSpans[0].Spans
		if len(spans) != 1 || spans[0].Name != "GET /hello" || len(spans[0].ParentSpanId) != 8 {
			t.Fatalf("missing server span or parent context: %v", spans)
		}
		if spans[0].EndTimeUnixNano < spans[0].StartTimeUnixNano {
			t.Fatal("invalid span timestamps")
		}
	case <-time.After(time.Second):
		t.Fatal("graceful shutdown did not flush the trace")
	}
}
