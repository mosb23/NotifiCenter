const ApiError = require('../core/apiError');

module.exports = (err, req, res, next) => {
  // Handle known API errors
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.toResponse());
  }

  // Handle validation errors (e.g., Joi)
  if (err.name === 'ValidationError') {
    const error = ApiError.badRequest('Validation Error', err.details);
    return res.status(error.code).json(error.toResponse());
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const error = ApiError.unauthorized('Invalid token');
    return res.status(error.code).json(error.toResponse());
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  const error = ApiError.internal(err);
  res.status(error.code).json(error.toResponse());
};