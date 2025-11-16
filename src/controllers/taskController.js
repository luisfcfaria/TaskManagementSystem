import taskService from "../services/taskService.js";

export default {
  async getAllTasks() {
    return taskService.getAllTasks();
  },

  async getTasksByUser(userId) {
    return taskService.getTasksByUser(userId);
  },

  async getTaskById(taskId) {
    return taskService.getTaskById(taskId);
  },

  async createTask(data) {
    const task = await taskService.createTask(data);

    // // Fire-and-forget notification
    // queueMicrotask(async () => {
    //     console.log(`📢 Notification: New task created -> ${task.id}`);
    //     // replace with real queue / Kafka / Redis event
    // });

    return task;
  },

  async updateTask(taskId, data) {
    return taskService.updateTask(taskId, data);
  },

  async deleteTask(taskId) {
    return taskService.deleteTask(taskId);
  },
};
