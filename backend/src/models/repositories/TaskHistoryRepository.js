const db = require('../index');

class TaskHistoryRepository {
  static async findAllByTaskId(taskId) {
    return db.TaskHistory.findAll({ where: { taskId } });
  }
  static async findAllByUserId(userId) {
    // Join Task to filter by userId
    return db.TaskHistory.findAll({
      include: [{ model: db.Task, where: { userId } }],
    });
  }
}

module.exports = TaskHistoryRepository; 