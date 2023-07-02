const { UNAUTHORIZED_ERROR } = require('./errorsCodes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = UnauthorizedError;
