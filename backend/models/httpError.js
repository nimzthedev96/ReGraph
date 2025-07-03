class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // adds message to property
    this.code = errorCode; // adds a code prop
  }
}

module.exports = HttpError;
