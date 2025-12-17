const express = require('express')
const boards = require('../controllers/boards.controller')
const columnsRouter = require('./columns.routes')

const router = express.Router()

router.get('/', boards.listBoards)
router.post('/', boards.createBoard)

router.get('/:boardId', boards.getBoard)
router.put('/:boardId', boards.updateBoard)
router.delete('/:boardId', boards.deleteBoard)

// nested columns
router.use('/:boardId/columns', columnsRouter)

module.exports = router
