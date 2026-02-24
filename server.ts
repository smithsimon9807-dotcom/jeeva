import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import db, { initDb } from './src/db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Database
initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/static/uploads', express.static(path.join(process.cwd(), 'static/uploads')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --- API ROUTES ---

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password, role } = req.body;

  if (role === 'Admin') {
    const admin = db.prepare('SELECT * FROM admin WHERE username = ? AND password = ?').get(username, password);
    if (admin) {
      return res.json({ success: true, role: 'Admin', user: { id: admin.id, username: admin.username } });
    }
  } else {
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?').get(username, password);
    if (user) {
      return res.json({ success: true, role: 'Employee', user: { id: user.id, name: user.emp_name, email: user.email } });
    }
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Admin: Employee Management
app.get('/api/admin/employees', (req, res) => {
  const employees = db.prepare('SELECT * FROM users').all();
  res.json(employees);
});

app.post('/api/admin/employees', upload.single('proof'), (req, res) => {
  const { emp_name, email, password, dob, department, role, doj, status, gender } = req.body;
  const proof = req.file ? req.file.filename : null;

  try {
    db.prepare(`
      INSERT INTO users (emp_name, email, password, dob, department, role, doj, status, gender, proof)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(emp_name, email, password, dob, department, role, doj, status, gender, proof);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/employees/:id', upload.single('proof'), (req, res) => {
  const { id } = req.params;
  const { emp_name, email, password, dob, department, role, doj, status, gender } = req.body;
  const proof = req.file ? req.file.filename : null;

  if (proof) {
    db.prepare(`
      UPDATE users SET emp_name=?, email=?, password=?, dob=?, department=?, role=?, doj=?, status=?, gender=?, proof=?
      WHERE id=?
    `).run(emp_name, email, password, dob, department, role, doj, status, gender, proof, id);
  } else {
    db.prepare(`
      UPDATE users SET emp_name=?, email=?, password=?, dob=?, department=?, role=?, doj=?, status=?, gender=?
      WHERE id=?
    `).run(emp_name, email, password, dob, department, role, doj, status, gender, id);
  }
  res.json({ success: true });
});

app.delete('/api/admin/employees/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ success: true });
});

// Admin: Task Management
app.get('/api/admin/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks').all();
  res.json(tasks);
});

app.post('/api/admin/tasks', (req, res) => {
  const { emp_id, task_name, description, specification, priority, assigned_date, due_date } = req.body;
  const user = db.prepare('SELECT emp_name, department FROM users WHERE id = ?').get(emp_id) as any;
  
  if (!user) return res.status(404).json({ success: false, message: 'Employee not found' });

  db.prepare(`
    INSERT INTO tasks (emp_id, emp_name, department, task_name, description, specification, priority, assigned_date, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(emp_id, user.emp_name, user.department, task_name, description, specification, priority, assigned_date, due_date);
  
  res.json({ success: true });
});

app.put('/api/admin/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task_name, description, specification, priority, assigned_date, due_date } = req.body;
  db.prepare(`
    UPDATE tasks SET task_name=?, description=?, specification=?, priority=?, assigned_date=?, due_date=?
    WHERE task_id=?
  `).run(task_name, description, specification, priority, assigned_date, due_date, id);
  res.json({ success: true });
});

app.delete('/api/admin/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM tasks WHERE task_id = ?').run(id);
  res.json({ success: true });
});

// Admin: Responses & Feedback
app.get('/api/admin/responses', (req, res) => {
  const responses = db.prepare('SELECT * FROM task_responses ORDER BY created_at DESC').all();
  res.json(responses);
});

app.post('/api/admin/feedback', (req, res) => {
  const { task_id, user_id, feedback, description, mark } = req.body;
  const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  db.prepare(`
    INSERT INTO task_feedback (task_id, user_id, feedback, description, mark, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(task_id, user_id, feedback, description, mark, createdAt);
  
  res.json({ success: true });
});

app.get('/api/admin/feedback', (req, res) => {
  const feedback = db.prepare(`
    SELECT f.*, 
           IFNULL(t.task_name, 'Deleted Task') as task_name, 
           IFNULL(u.emp_name, 'Deleted User') as emp_name
    FROM task_feedback f
    LEFT JOIN tasks t ON f.task_id = t.task_id
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
  `).all();
  res.json(feedback);
});

// Admin: Analysis
app.get('/api/admin/analysis', (req, res) => {
  const { emp_id, period, type } = req.query; // type: 'month' or 'year'
  let query = `
    SELECT t.*, tr.task_status, tr.description as response_description
    FROM tasks t
    LEFT JOIN task_responses tr ON t.task_id = tr.task_id AND t.emp_id = tr.user_id
    WHERE t.emp_id = ?
  `;
  
  if (type === 'month') {
    query += ` AND substr(t.assigned_date, 1, 7) = ?`;
  } else {
    query += ` AND substr(t.assigned_date, 1, 4) = ?`;
  }
  
  const results = db.prepare(query).all(emp_id, period);
  res.json(results);
});

// Employee: Profile & Tasks
app.get('/api/employee/profile/:id', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  res.json(user);
});

app.get('/api/employee/tasks/:id', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE emp_id = ? ORDER BY task_id DESC').all(req.params.id);
  res.json(tasks);
});

app.post('/api/employee/responses', upload.single('document'), (req, res) => {
  const { task_id, user_id, task_status, description } = req.body;
  const document = req.file ? req.file.filename : null;
  const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const user = db.prepare('SELECT emp_name FROM users WHERE id = ?').get(user_id) as any;
  const task = db.prepare('SELECT task_name FROM tasks WHERE task_id = ?').get(task_id) as any;

  if (!user || !task) return res.status(404).json({ success: false, message: 'User or Task not found' });

  db.prepare(`
    INSERT INTO task_responses (task_id, user_id, user_name, task_name, task_status, description, document, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(task_id, user_id, user.emp_name, task.task_name, task_status, description, document, createdAt);

  res.json({ success: true });
});

app.get('/api/employee/responses/:id', (req, res) => {
  const responses = db.prepare('SELECT * FROM task_responses WHERE user_id = ? ORDER BY response_id DESC').all(req.params.id);
  res.json(responses);
});

app.get('/api/employee/feedback/:id', (req, res) => {
  const feedback = db.prepare(`
    SELECT f.*, t.task_name
    FROM task_feedback f
    JOIN tasks t ON f.task_id = t.task_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `).all(req.params.id);
  res.json(feedback);
});

// --- VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
