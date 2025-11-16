// services/taskService.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default {
  async getAllTasks() {
    return prisma.task.findMany();
  },

  async getTasksByUser(userId) {
    return prisma.task.findMany({
      where: { userId },
    });
  },

  async getTaskById(taskId) {
    return prisma.task.findUnique({
      where: { id: taskId },
    });
  },

  async createTask(data) {
    // data must include userId (enforced in route)
    return prisma.task.create({
      data: {
        title: data.title,
        summary: data.summary,
        userId: data.userId,
      },
    });
  },

  async updateTask(taskId, data) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  },

  async deleteTask(taskId) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  },
};
