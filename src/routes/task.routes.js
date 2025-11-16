import { verifyAuth } from "../plugins/auth.js";
import taskController from "../controllers/taskController.js";

export async function taskRoutes(fastify) {
  fastify.get("/tasks", async (req, reply) => {
    const payload = req.jwtVerify();

    if (payload.role === "TECHNICIAN") {
      return taskController.getTasksByUser(req.user.id);
    }
    return taskController.getAllTasks();
  });

  fastify.post(
    "/tasks",
    {
      preHandler: fastify.requireRole("TECHNICIAN", "MANAGER"),
    },
    async (req, reply) => {
      const data = req.body;

      if (req.user.role === "TECHNICIAN") {
        data.userId = req.user.id; // enforce ownership
      }

      return taskController.createTask(data);
    },
  );

  fastify.put(
    "/:id",
    {
      preHandler: fastify.requireOwnerOrManager(taskController.getTaskById),
    },
    async (req, reply) => {
      return taskController.updateTask(req.params.id, req.body);
    },
  );

  fastify.delete(
    "/:id",
    {
      preHandler: fastify.requireRole("MANAGER"),
    },
    async (req, reply) => {
      return taskController.deleteTask(req.params.id);
    },
  );
}
