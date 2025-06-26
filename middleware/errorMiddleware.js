// Global error handler middleware for Express
module.exports = (err, req, res, next) => {
  console.error(err.stack || err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred. Please try again later.',
  });
};