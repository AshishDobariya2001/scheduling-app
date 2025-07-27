const { resCode } = require('../../config/options');
const BaseHTTPException = require('./base-http.exception');

module.exports = class InternalServerException extends BaseHTTPException {
  constructor(message = 'Internal Server Error', data = {}) {
    super(message, resCode.HTTP_INTERNAL_SERVER_ERROR);
    this.data = data;
  }
};
