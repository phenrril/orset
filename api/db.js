const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data", "leads.db");

require("fs").mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    company TEXT,
    answers TEXT NOT NULL,
    score INTEGER NOT NULL,
    level TEXT NOT NULL,
    priorities TEXT NOT NULL
  )
`);

function saveLead(lead) {
  const stmt = db.prepare(`
    INSERT INTO leads (created_at, name, email, whatsapp, company, answers, score, level, priorities)
    VALUES (@created_at, @name, @email, @whatsapp, @company, @answers, @score, @level, @priorities)
  `);
  return stmt.run(lead);
}

module.exports = { db, saveLead };
