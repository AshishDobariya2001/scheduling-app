const express = require('express');
const router = express.Router();
const TaskController = require('../../../controllers/Task');
const AuthHandler = require('../../../models/helpers/AuthHelper');
const { userRoles } = require('../../../config/options');
const { checkSchema } = require('express-validator');
const TaskSchema = require('../../../schema-validation/Task');

// Task CRUD operations
router.post('/', 
  checkSchema(TaskSchema.createTask),
  AuthHandler.authenticateJWT([userRoles.USER]),
  TaskController.createTask
);

router.get('/', 
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.getAllTasks
);

router.get('/:id', 
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.getTaskById
);

router.put('/:id', 
  checkSchema(TaskSchema.updateTask),
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.updateTask
);

router.delete('/:id', 
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.deleteTask
);

// Task history endpoints
router.get('/:id/history', 
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.getTaskHistory
);

router.get('/history/all', 
  AuthHandler.authenticateJWT([userRoles.USER]), 
  TaskController.getAllTaskHistory
);

module.exports = router;
