import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { get, run, query } from './db.js';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

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

    const scoreResult = await get(
      'SELECT AVG(CAST(score AS FLOAT)/total_questions) * 100 as avgScore FROM quiz_scores WHERE user_id = ?'
      , [userId]
    );
    const averageScore = scoreResult && scoreResult.avgScore ? Math.round(scoreResult.avgScore) : null;
    
    res.json({ totalNotes, recentTopics, averageScore });
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

app.post('/api/quiz/score', authenticateToken, async (req, res) => {
  const { topic, score, total_questions } = req.body;
  const userId = req.user.id;

  if (!topic || score === undefined || !total_questions) {
    return res.status(400).json({ error: 'Invalid score payload' });
  }

  try {
    await run('INSERT INTO quiz_scores (user_id, topic, score, total_questions) VALUES (?, ?, ?, ?)', 
      [userId, topic, score, total_questions]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to record quiz score' });
  }
});

// --- AI GENERATION ROUTES ---
app.post('/api/generate', authenticateToken, async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3001",
        "X-Title": "Gradify App"
      },
      body: JSON.stringify({
        "model": "nousresearch/hermes-3-llama-3.1-405b:free",
        "messages": [
          {
            "role": "system",
            "content": "You are Gradify, an expert educational AI tutor. You MUST respond ONLY with a raw, valid JSON object, without any markdown formatting blocks or syntax highlighting. Do not wrap the JSON in ```json or any other text. Output exactly this JSON structure based on the user's topic:\n\n{\n  \"topic\": \"The Topic Title\",\n  \"notes\": \"Markdown String of comprehensive study notes explaining key concepts.\",\n  \"lessonPlan\": \"Markdown String of a step-by-step actionable lesson plan.\",\n  \"quiz\": [\n    {\n      \"question\": \"Question 1 string\",\n      \"options\": [\"A\", \"B\", \"C\", \"D\"],\n      \"answerIndex\": 0\n    }\n  ]\n}\n\nThe quiz array MUST contain 3 to 5 questions. The options array MUST contain exactly 4 strings. answerIndex MUST be an integer between 0 and 3."
          },
          {
            "role": "user",
            "content": `Please generate the JSON educational suite for the following topic: ${topic}`
          }
        ]
      })
    });

    if (!response.ok) {
      console.error("OpenRouter API error:", await response.text());
      return res.status(500).json({ error: 'Failed to generate notes with AI.' });
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
       console.error("Unexpected OpenRouter response structure:", JSON.stringify(data));
       return res.status(500).json({ error: 'AI returned an unexpected response format.' });
    }
    
    let aiText = data.choices[0].message.content.trim();
    
    // Attempt to strip out Markdown code blocks if the AI disobeyed instructions
    if (aiText.startsWith('```json')) {
      aiText = aiText.substring(7);
      if (aiText.endsWith('```')) aiText = aiText.slice(0, -3);
    } else if (aiText.startsWith('```')) {
      aiText = aiText.substring(3);
      if (aiText.endsWith('```')) aiText = aiText.slice(0, -3);
    }
    
    let generatedData;
    try {
      generatedData = JSON.parse(aiText);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON response:", aiText);
      return res.status(500).json({ error: 'AI failed to format response as valid JSON.' });
    }
    
    // Automatically record progress on successful generation
    const userId = req.user.id;
    await run('INSERT INTO progress (user_id, topic) VALUES (?, ?)', [userId, topic]);

    res.json(generatedData);
  } catch (err) {
    console.error("AI Generation error:", err.stack || err);
    res.status(500).json({ error: 'Server error during generation.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
