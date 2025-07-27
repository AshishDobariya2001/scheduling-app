'use strict';

const { taskStatus } = require('../src/config/options');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('TaskHistory', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      taskId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Task',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(...taskStatus.getAllStatuses()),
        allowNull: false,
      },
      attemptNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      executedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      response: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      responseTime: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      statusCode: {
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('TaskHistory', ['taskId']);
    await queryInterface.addIndex('TaskHistory', ['executedAt']);
    await queryInterface.addIndex('TaskHistory', ['status']);
    await queryInterface.addIndex('TaskHistory', ['taskId', 'attemptNumber']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskHistory');
  }
};
