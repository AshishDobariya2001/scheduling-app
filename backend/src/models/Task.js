const { taskStatus, httpMethods } = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM(...httpMethods.getAllMethods()),
        allowNull: false,
        defaultValue: httpMethods.GET,
      },
      headers: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      scheduledTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      maxRetry: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...taskStatus.getAllStatuses()),
        allowNull: false,
        defaultValue: taskStatus.PENDING,
      },
      body: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      retryCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastExecutedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      nextExecutionAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      response: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      error: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    
    Task.hasMany(models.TaskHistory, {
      foreignKey: 'taskId',
      as: 'history',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return Task;
};

