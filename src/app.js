import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import { authenticateRoutes } from "./routes/auth.routes.js";
import { taskRoutes } from "./routes/task.routes.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { authPlugin, verifyAuth } from "./plugins/auth.js";

const { environment } = await import("./environment/environment.js");

export function buildApp() {
  const app = Fastify({
    logger: environment.logger.enabled ?? true,
    level: environment.logger.level ?? "info",
  });

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Task Management API",
        description: "Task Management API documentation",
        version: "1.0.0",
      },
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/docs",
  });

  app.get("/health", { logLevel: "silent" }, (_req, reply) => {
    reply.send({ status: "OK" });
  });

  app.register(authenticateRoutes);
  app.register(authPlugin);
  app.register(prismaPlugin);

  app.register(taskRoutes);

  return app;
}
