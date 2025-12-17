const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { seed } = require('./data/seed')

// Middlewares
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

// Parse body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Custom logger
app.use(logger())

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routers
const boardsRouter = require('./routes/boards.routes')
app.use('/api/boards', boardsRouter)

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now() })
})

// 404 for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Error handler
app.use(errorHandler())

seed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kanban API listening on http://localhost:${PORT}`)
    })
  })
  .catch((e) => {
    console.error('Failed to seed initial data', e)
    process.exit(1)
  })
