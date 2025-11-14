import { register, collectDefaultMetrics } from "prom-client";

register.setDefaultLabels({
  environment: process.env.NODE_ENV ?? "local",
  service: "task-management",
});

collectDefaultMetrics({ register });

export { register };
