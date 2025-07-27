const { resCode } = require('../../config/options');
const BaseHTTPException = require('./base-http.exception');

module.exports = class NotFoundException extends BaseHTTPException {
  constructor(message = 'Not Found', data = {}) {
    super(message, resCode.HTTP_NOT_FOUND);
    this.data = data;
  }
};
