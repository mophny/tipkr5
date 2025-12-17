const express = require('express')
const tasks = require('../controllers/tasks.controller')

const router = express.Router({ mergeParams: true })

router.get('/', tasks.listTasks)
router.post('/', tasks.createTask)

router.get('/:taskId', tasks.getTask)
router.put('/:taskId', tasks.updateTask)
router.delete('/:taskId', tasks.deleteTask)

module.exports = router
