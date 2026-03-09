import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { get, run, query } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super-secret-gradify-key-for-local-dev-only';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const existing = await get('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Note: In production, ALWAYS hash passwords (e.g., using bcrypt). 
    // We are skipping it here to keep the prototype simple per user request.
    const result = await run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    
    // Generate token
    const token = jwt.sign({ id: result.id, username }, JWT_SECRET);
    res.json({ token, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PROGRESS ROUTES ---

app.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const countResult = await get('SELECT COUNT(*) as total FROM progress WHERE user_id = ?', [userId]);
    const totalNotes = countResult.total;
    
    const topicsResult = await query(
      'SELECT topic FROM progress WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    const recentTopics = topicsResult.map(r => r.topic);
    
    res.json({ totalNotes, recentTopics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

app.post('/api/user/progress', authenticateToken, async (req, res) => {
  const { topic } = req.body;
  const userId = req.user.id;
  
  if (!topic) {
    return res.status(400).json({ error: 'Topic required' });
  }

  try {
    await run('INSERT INTO progress (user_id, topic) VALUES (?, ?)', [userId, topic]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record progress' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
