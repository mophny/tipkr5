const fs = require('fs').promises
const path = require('path')

const DB_PATH = path.join(__dirname, 'db.json')

async function ensureDB() {
  try {
    await fs.access(DB_PATH)
  } catch {
    const initial = { boards: [], columns: [], tasks: [] }
    await fs.writeFile(DB_PATH, JSON.stringify(initial, null, 2))
  }
}

async function read() {
  await ensureDB()
  const raw = await fs.readFile(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

async function write(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
}

function genId(prefix = '') {
  const rnd = Math.random().toString(36).slice(2, 8)
  return `${prefix}${Date.now().toString(36)}${rnd}`
}

module.exports = { read, write, genId }
