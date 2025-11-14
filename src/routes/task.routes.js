import { verifyAuth } from "../plugins/auth.js";

export async function taskRoutes(fastify) {
  // fastify.register(verifyAuth); // JWT/RBAC preHandler

  // fastify.post("/", taskController.createTask);
  fastify.get("/", () => ({ hey: "badjoras" }));
  // fastify.put("/:id", taskController.updateTask);
  // fastify.delete("/:id", taskController.deleteTask);
}
