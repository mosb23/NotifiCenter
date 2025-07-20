class ApiResponse {
  static success(data, message = 'Success', code = 200) {
    return {
      success: true,
      code,
      message,
      data
    };
  }

  static created(data, message = 'Resource created') {
    return this.success(data, message, 201);
  }

  static noContent(message = 'No content') {
    return this.success(null, message, 204);
  }
}

module.exports = ApiResponse;