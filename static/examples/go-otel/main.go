// A minimal OTLP/HTTP tracing example. Run against a test receiver.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	"go.opentelemetry.io/otel/trace"
)

func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Endpoint, protocol and headers use standard OTEL_EXPORTER_OTLP_* variables.
	exporter, err := otlptracehttp.New(ctx)
	if err != nil {
		return fmt.Errorf("create OTLP exporter: %w", err)
	}
	res, err := resource.New(ctx, resource.WithFromEnv(), resource.WithAttributes(
		attribute.String("service.version", "docs-example"),
	))
	if err != nil {
		return fmt.Errorf("create resource: %w", err)
	}
	provider := sdktrace.NewTracerProvider(sdktrace.WithBatcher(exporter), sdktrace.WithResource(res))
	defer func() {
		flush, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := provider.Shutdown(flush); err != nil {
			log.Printf("flush traces: %v", err)
		}
	}()
	otel.SetTracerProvider(provider)
	otel.SetTextMapPropagator(propagation.TraceContext{})
	tracer := otel.Tracer("avuru-docs/go-example")
	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {
		parent := otel.GetTextMapPropagator().Extract(r.Context(), propagation.HeaderCarrier(r.Header))
		_, span := tracer.Start(parent, "GET /hello", trace.WithSpanKind(trace.SpanKindServer),
			trace.WithAttributes(attribute.String("http.request.method", "GET"), attribute.String("http.route", "/hello")))
		defer span.End()
		span.SetAttributes(attribute.Int("http.response.status_code", http.StatusOK))
		// Kubernetes stdout collection can correlate this line without a second log exporter.
		line, err := json.Marshal(map[string]string{
			"level": "INFO", "message": "hello request handled",
			"trace_id": span.SpanContext().TraceID().String(),
			"span_id":  span.SpanContext().SpanID().String(),
		})
		if err != nil {
			log.Printf("encode log: %v", err)
		} else {
			fmt.Println(string(line))
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = fmt.Fprintln(w, "hello from avuru-go-example")
	})
	server := &http.Server{Addr: "127.0.0.1:8081", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	serverErrors := make(chan error, 1)
	go func() { serverErrors <- server.ListenAndServe() }()
	log.Print("listening on http://127.0.0.1:8081/hello")
	select {
	case err := <-serverErrors:
		if !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("serve: %w", err)
		}
	case <-ctx.Done():
		shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := server.Shutdown(shutdown); err != nil {
			return fmt.Errorf("shutdown HTTP server: %w", err)
		}
	}
	return nil
}

func main() {
	if err := run(); err != nil {
		log.Print(err)
		os.Exit(1)
	}
}
