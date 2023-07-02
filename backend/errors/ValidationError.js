const { VALIDATION_ERROR } = require('./errorsCodes');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
    this.message = message;
  }
}

module.exports = ValidationError;
