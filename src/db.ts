import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'employee_management.db');
let db: any;

try {
  db = new Database(dbPath);
} catch (err) {
  console.error('Failed to connect to database:', err);
  // Fallback or rethrow
  throw err;
}

// Initialize tables
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      dob TEXT,
      department TEXT,
      role TEXT,
      doj TEXT,
      status TEXT,
      gender TEXT,
      proof TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      task_id INTEGER PRIMARY KEY AUTOINCREMENT,
      emp_id INTEGER,
      emp_name TEXT,
      department TEXT,
      task_name TEXT,
      description TEXT,
      specification TEXT,
      priority TEXT,
      assigned_date TEXT,
      due_date TEXT,
      FOREIGN KEY (emp_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS task_responses (
      response_id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      user_id INTEGER,
      user_name TEXT,
      task_name TEXT,
      task_status TEXT,
      description TEXT,
      document TEXT,
      created_at TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(task_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS task_feedback (
      feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER,
      user_id INTEGER,
      feedback TEXT,
      description TEXT,
      mark INTEGER,
      created_at TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(task_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Seed admin if not exists
  const adminExists = db.prepare('SELECT * FROM admin WHERE username = ?').get('admin');
  if (!adminExists) {
    db.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('admin', 'admin');
  }

  // Ensure uploads directory exists
  const uploadsDir = path.resolve(process.cwd(), 'static/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

export default db;
