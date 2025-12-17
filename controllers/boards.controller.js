const store = require('../data/store')

async function listBoards(req, res, next) {
  try {
    const { search } = req.query
    const db = await store.read()
    let boards = db.boards
    if (search) {
      const s = String(search).toLowerCase()
      boards = boards.filter(b => b.name.toLowerCase().includes(s))
    }
    res.json(boards)
  } catch (e) { next(e) }
}

async function getBoard(req, res, next) {
  try {
    const { boardId } = req.params
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    const columns = db.columns.filter(c => c.boardId === boardId)
    const tasks = db.tasks.filter(t => t.boardId === boardId)
    res.json({ ...board, columns, tasks })
  } catch (e) { next(e) }
}

async function createBoard(req, res, next) {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const db = await store.read()
    const board = { id: store.genId('b_'), name }
    db.boards.push(board)
    await store.write(db)
    res.status(201).json(board)
  } catch (e) { next(e) }
}

async function updateBoard(req, res, next) {
  try {
    const { boardId } = req.params
    const { name } = req.body
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    if (name) board.name = name
    await store.write(db)
    res.json(board)
  } catch (e) { next(e) }
}

async function deleteBoard(req, res, next) {
  try {
    const { boardId } = req.params
    const db = await store.read()
    const exists = db.boards.some(b => b.id === boardId)
    if (!exists) return res.status(404).json({ error: 'Board not found' })
    db.boards = db.boards.filter(b => b.id !== boardId)
    const colIds = db.columns.filter(c => c.boardId === boardId).map(c => c.id)
    db.columns = db.columns.filter(c => c.boardId !== boardId)
    db.tasks = db.tasks.filter(t => t.boardId !== boardId && !colIds.includes(t.columnId))
    await store.write(db)
    res.status(204).end()
  } catch (e) { next(e) }
}

module.exports = { listBoards, getBoard, createBoard, updateBoard, deleteBoard }
