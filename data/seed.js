const store = require('./store')

async function seed() {
  const db = await store.read()
  if (db.boards.length > 0) return // уже инициализировано

  const board = { id: store.genId('b_'), name: 'My Kanban Board' }
  const colTodo = { id: store.genId('c_'), boardId: board.id, name: 'To Do', order: 0 }
  const colDoing = { id: store.genId('c_'), boardId: board.id, name: 'In Process', order: 1 }
  const colDone = { id: store.genId('c_'), boardId: board.id, name: 'Done', order: 2 }

  db.boards.push(board)
  db.columns.push(colTodo, colDoing, colDone)
  await store.write(db)
}

module.exports = { seed }
