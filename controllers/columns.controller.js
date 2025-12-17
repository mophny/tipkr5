const store = require('../data/store')

async function listColumns(req, res, next) {
  try {
    const { boardId } = req.params
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    const columns = db.columns.filter(c => c.boardId === boardId)
    res.json(columns)
  } catch (e) { next(e) }
}

async function getColumn(req, res, next) {
  try {
    const { boardId, columnId } = req.params
    const db = await store.read()
    const col = db.columns.find(c => c.id === columnId && c.boardId === boardId)
    if (!col) return res.status(404).json({ error: 'Column not found' })
    res.json(col)
  } catch (e) { next(e) }
}

async function createColumn(req, res, next) {
  try {
    const { boardId } = req.params
    const { name } = req.body
    if (!name) return res.status(400).json({ error: 'name is required' })
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    const column = { id: store.genId('c_'), boardId, name }
    db.columns.push(column)
    await store.write(db)
    res.status(201).json(column)
  } catch (e) { next(e) }
}

async function updateColumn(req, res, next) {
  try {
    const { boardId, columnId } = req.params
    const { name } = req.body
    const db = await store.read()
    const col = db.columns.find(c => c.id === columnId && c.boardId === boardId)
    if (!col) return res.status(404).json({ error: 'Column not found' })
    if (name) col.name = name
    await store.write(db)
    res.json(col)
  } catch (e) { next(e) }
}

async function deleteColumn(req, res, next) {
  try {
    const { boardId, columnId } = req.params
    const db = await store.read()
    const col = db.columns.find(c => c.id === columnId && c.boardId === boardId)
    if (!col) return res.status(404).json({ error: 'Column not found' })
    db.columns = db.columns.filter(c => !(c.id === columnId && c.boardId === boardId))
    db.tasks = db.tasks.filter(t => !(t.columnId === columnId && t.boardId === boardId))
    await store.write(db)
    res.status(204).end()
  } catch (e) { next(e) }
}

module.exports = { listColumns, getColumn, createColumn, updateColumn, deleteColumn }
