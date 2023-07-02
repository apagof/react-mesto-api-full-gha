const { REFERENCE_ERROR } = require('./errorsCodes');

class ReferenceError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = REFERENCE_ERROR;
  }
}

module.exports = ReferenceError;
