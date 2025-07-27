const { taskStatus } = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const TaskHistory = sequelize.define(
    'TaskHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...taskStatus.getAllStatuses()),
        allowNull: false,
      },
      attemptNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      executedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      response: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responseTime: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  TaskHistory.associate = (models) => {
    TaskHistory.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return TaskHistory;
};
