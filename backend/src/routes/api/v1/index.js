const express = require('express');

const router = express.Router();

const AuthRouter = require('./Auth');
const TaskRouter = require('./Task');

/**
 * APIs routes.
 */
router.use('/auth', AuthRouter);
router.use('/task', TaskRouter);

module.exports = router;
