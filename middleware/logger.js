module.exports = function logger() {
  return (req, res, next) => {
    const start = Date.now()
    const { method, originalUrl, query } = req
    res.on('finish', () => {
      const ms = Date.now() - start
      // Minimal friendly log
      console.log(`${method} ${originalUrl} ${res.statusCode} ${ms}ms`, Object.keys(query).length ? { query } : '')
    })
    next()
  }
}
