import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

export const authPlugin = fastifyPlugin(async (fastify, options) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET required");
  }

  await fastify.register(fastifyJwt, {
    secret,
    sign: {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
    },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      const payload = await request.jwtVerify();
      console.log(payload);
      request.user = {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (err) {
      return reply.code(401).send({
        code: "AUTH_ERROR",
        message: "Unauthorized",
      });
    }
  });

  fastify.decorate("requireRole", function (roles = []) {
    return async function (request, reply) {
      const payload = await request.jwtVerify();
      const userRole = payload.role;

      if (!roles.includes(userRole)) {
        return reply.code(403).send({
          code: "FORBIDDEN",
          message: "Forbidden: insufficient role",
        });
      }
    };
  });

  fastify.decorate("requireOwnerOrManager", function (getTaskById) {
    return async function (request, reply) {
      const payload = await request.jwtVerify();
      const userRole = payload.role;
      const user = request.user;
      const taskId = request.params.id;

      const task = await getTaskById(taskId);
      if (!task) {
        return reply.code(404).send({
          code: "TASK_NOT_FOUND",
          message: "Task not found",
        });
      }

      if (userRole === "MANAGER") return;

      if (userRole === "TECHNICIAN" && task.userId !== user.id) {
        return reply.code(403).send({
          code: "FORBIDDEN",
          message: "Forbidden: you do not own this task",
        });
      }
    };
  });
});

export const verifyAuth = fastifyPlugin(async (fastify, opts) => {
  if (!fastify.authenticate) {
    throw new Error(
      "fastify.authenticate decorator is not registered. Register authPlugin before verifyAuth.",
    );
  }
  fastify.addHook("preHandler", fastify.authenticate);
});
