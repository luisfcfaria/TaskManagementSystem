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
      expiresIn: process.env.JWT_EXPIRES_IN ?? "15M",
    },
  });

  fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({
        code: "AUTH_ERROR",
        message: "Unauthorized",
      });
    }
  });

  fastify.decorate("requireRole", function (roles = []) {
    return async function (request, reply) {
      const payload = request.user;
      if (!payload || !roles.includes(payload.role)) {
        return reply
          .code(403)
          .send({ code: "FORBIDDEN", message: "Forbidden" });
      }
    };
  });
});

export const verifyAuth = fastifyPlugin(async (fastify, opts) => {
  if (!fastify.authenticate) {
    throw new Error(
      "fastify.authenticate decorator is not registered. Register auth plugin before verifyAuth.",
    );
  }
  fastify.addHook("preHandler", fastify.authenticate);
});
