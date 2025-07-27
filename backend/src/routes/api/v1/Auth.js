const express = require('express');
const AuthControl = require('../../../controllers/Auth');
const { checkSchema } = require('express-validator');
const { requestValidator } = require('../../../middleware/ErrorHandleHelper');


const router = express.Router();

const AuthSchema = require('../../../schema-validation/Auth');
router.post('/register', checkSchema(AuthSchema.register), AuthControl.register);

router.post('/login', checkSchema(AuthSchema.login), AuthControl.login);

module.exports = router;
