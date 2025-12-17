const express = require('express')
const columns = require('../controllers/columns.controller')
const tasksRouter = require('./tasks.routes')

const router = express.Router({ mergeParams: true })

router.get('/', columns.listColumns)
router.post('/', columns.createColumn)

router.get('/:columnId', columns.getColumn)
router.put('/:columnId', columns.updateColumn)
router.delete('/:columnId', columns.deleteColumn)

router.use('/:columnId/tasks', tasksRouter)

module.exports = router
