// src/middleware/error.middleware.js
export default function errorHandler(err, req, res, next) {
  console.error('ERROR HANDLER:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: { message } });
}
