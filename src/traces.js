import * as dotenv from "dotenv";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PrismaInstrumentation } from "@prisma/instrumentation";

dotenv.config();
if (process.env.OTEL_DEBUG === "1") {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
}

const traceExporter = new OTLPTraceExporter({
  url: `${process.env.OTLP_URL}/v1/traces`,
  headers: {
    // username = instance id, password = API key (TracesPublisher)
    Authorization: `Basic ${Buffer.from(
      `${process.env.OTLP_USER}:${process.env.OTLP_API_KEY}`,
    ).toString("base64")}`,
  },
});

// Prometheus metrics exporter (no HTTP server started by the SDK)
const metricExporter = new PrometheusExporter({ preventServerStart: true });

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.FLY_APP_NAME ?? "task-management",
  "deployment.environment.name": process.env.NODE_ENV ?? "dev",
  service: process.env.FLY_APP_NAME ?? "task-management",
  environment: process.env.NODE_ENV ?? "dev",
  region: process.env.FLY_REGION,
  instance: process.env.FLY_MACHINE_ID,
});

const sdk = new NodeSDK({
  resource: resource,
  traceExporter,
  metricReader: metricExporter,

  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-http": {
        ignoreIncomingRequestHook: (req) =>
          (req.url || "").startsWith("/health") ||
          (req.url || "").startsWith("/metrics"),
      },
      "@opentelemetry/instrumentation-fastify": {
        requestHook: (span, info) => {
          const route =
            info?.request?.routerPath ||
            info?.request?.routeOptions?.url ||
            info?.request?.raw?.url;
          if (route) span.setAttribute("http.route", route);
        },
      },
    }),
    new PrismaInstrumentation({
      enabled: true,
    }),
  ],
});

if (!(process.env.NODE_ENV === "local")) {
  sdk.start();

  const shutdown = async () => {
    try {
      await sdk.shutdown();
    } finally {
      process.exit(0);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGTERM", shutdown);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  process.on("SIGINT", shutdown);
}
