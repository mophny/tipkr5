module.exports = function errorHandler() {
  // Express error-handling middleware
  return (err, req, res, next) => {
    console.error('Error:', err)
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Internal Server Error' })
  }
}
