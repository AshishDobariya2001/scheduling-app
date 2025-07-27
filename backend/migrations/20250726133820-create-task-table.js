'use strict';
const { taskStatus,httpMethods } = require('../src/config/options');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Task', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM(...httpMethods.getAllMethods()),
        allowNull: false,
        defaultValue: httpMethods.GET,
      },
      headers: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scheduledTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      maxRetry: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(...taskStatus.getAllStatuses()),
        allowNull: false,
        defaultValue: taskStatus.PENDING,
      },
      body: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      retryCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastExecutedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      nextExecutionAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      response: {
        type: Sequelize.JSON,
        allowNull: true,
      },
  
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes for better performance
    await queryInterface.addIndex('Task', ['userId']);
    await queryInterface.addIndex('Task', ['status']);
    await queryInterface.addIndex('Task', ['scheduledTime']);
    await queryInterface.addIndex('Task', ['nextExecutionAt']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Task');
  }
};
