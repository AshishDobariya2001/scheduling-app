const { validationResult } = require('express-validator');
const OPTIONS = require('../config/options');

const { resCode } = OPTIONS;

exports.requestValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(resCode.HTTP_BAD_REQUEST)
      .json({
        status: resCode.HTTP_BAD_REQUEST,
        errors: errors.array(),
        exception: 'InputValidationException'
      });
  }
  next();
};
