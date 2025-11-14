import * as taskController from "../controllers/taskController.js";
import { verifyAuth } from "../plugins/auth.js";

async function taskRoutes(fastify) {
  fastify.register(verifyAuth); // JWT/RBAC preHandler

  fastify.post("/", taskController.createTask);
  fastify.get("/", taskController.getMyTasks);
  fastify.put("/:id", taskController.updateTask);
  fastify.delete("/:id", taskController.deleteTask);
}

export default taskRoutes;
