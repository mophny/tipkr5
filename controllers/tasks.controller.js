const store = require('../data/store')

async function listTasks(req, res, next) {
  try {
    const { boardId, columnId } = req.params
    const { q, status } = req.query
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    const column = db.columns.find(c => c.id === columnId && c.boardId === boardId)
    if (!column) return res.status(404).json({ error: 'Column not found' })
    let tasks = db.tasks.filter(t => t.boardId === boardId && t.columnId === columnId)
    if (q) {
      const s = String(q).toLowerCase()
      tasks = tasks.filter(t => (t.title || '').toLowerCase().includes(s) || (t.description || '').toLowerCase().includes(s))
    }
    if (status) {
      tasks = tasks.filter(t => String(t.status) === String(status))
    }
    res.json(tasks)
  } catch (e) { next(e) }
}

async function getTask(req, res, next) {
  try {
    const { boardId, columnId, taskId } = req.params
    const db = await store.read()
    const task = db.tasks.find(t => t.id === taskId && t.boardId === boardId && t.columnId === columnId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (e) { next(e) }
}

async function createTask(req, res, next) {
  try {
    const { boardId, columnId } = req.params
    const { title, description = '', status = 'todo' } = req.body
    if (!title) return res.status(400).json({ error: 'title is required' })
    const db = await store.read()
    const board = db.boards.find(b => b.id === boardId)
    if (!board) return res.status(404).json({ error: 'Board not found' })
    const column = db.columns.find(c => c.id === columnId && c.boardId === boardId)
    if (!column) return res.status(404).json({ error: 'Column not found' })
    const task = { id: store.genId('t_'), boardId, columnId, title, description, status }
    db.tasks.push(task)
    await store.write(db)
    res.status(201).json(task)
  } catch (e) { next(e) }
}

async function updateTask(req, res, next) {
  try {
    const { boardId, columnId, taskId } = req.params
    const { title, description, status, columnId: newColumnId } = req.body
    const db = await store.read()
    const task = db.tasks.find(t => t.id === taskId && t.boardId === boardId && t.columnId === columnId)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    if (title !== undefined) task.title = title
    if (description !== undefined) task.description = description
    if (status !== undefined) task.status = status
    if (newColumnId && newColumnId !== columnId) {
      const targetCol = db.columns.find(c => c.id === newColumnId && c.boardId === boardId)
      if (!targetCol) return res.status(400).json({ error: 'Target column not found in this board' })
      task.columnId = newColumnId
    }
    await store.write(db)
    res.json(task)
  } catch (e) { next(e) }
}

async function deleteTask(req, res, next) {
  try {
    const { boardId, columnId, taskId } = req.params
    const db = await store.read()
    const exists = db.tasks.some(t => t.id === taskId && t.boardId === boardId && t.columnId === columnId)
    if (!exists) return res.status(404).json({ error: 'Task not found' })
    db.tasks = db.tasks.filter(t => !(t.id === taskId && t.boardId === boardId && t.columnId === columnId))
    await store.write(db)
    res.status(204).end()
  } catch (e) { next(e) }
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask }
