const { resCode, errorMessage } = require('../../config/options');
const BaseHTTPException = require('./base-http.exception');

module.exports = class UnauthorizedException extends BaseHTTPException {
  constructor(message = errorMessage.UNAUTHORIZED_ACCESS, data = {}) {
    super(message, resCode.HTTP_UNAUTHORIZED);
    this.data = data;
  }
};
