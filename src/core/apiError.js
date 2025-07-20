class ApiError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.code = code;
    this.details = details;
  }

  static badRequest(message, details) {
    return new ApiError(400, message || 'Bad Request', details);
  }

  static unauthorized(message) {
    return new ApiError(401, message || 'Unauthorized');
  }

  static notFound(message) {
    return new ApiError(404, message || 'Not Found');
  }

  static conflict(message) {
    return new ApiError(409, message || 'Conflict');
  }

  static internal(error) {
    return new ApiError(500, 'Internal Server Error', error.message);
  }

  toResponse() {
    return {
      success: false,
      code: this.code,
      message: this.message,
      ...(this.details && { details: this.details })
    };
  }
}

module.exports = ApiError;