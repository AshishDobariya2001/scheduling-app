const { resCode } = require('../../config/options');
const BaseHTTPException = require('./base-http.exception');

module.exports = class BadRequestException extends BaseHTTPException {
  constructor(message = 'Bad Request', data = {}, extra = {}) {
    super(message, resCode.HTTP_BAD_REQUEST);
    this.data = data;
    this.extra = extra;
  }
};
