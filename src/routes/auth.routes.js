import { loginHandler } from "../controllers/authController.js";

export async function authenticateRoutes(fastify) {
  fastify.post(
    "/login",
    {
      body: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
        },
      },
    },
    loginHandler,
  );
}
