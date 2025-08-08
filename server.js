/*

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5550', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_jwt_secret';
const PORT = 4000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_auth',
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to MySQL database successfully');
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied - No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working correctly!' });
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'All fields are required',
      missing: {
        username: !username,
        email: !email,
        password: !password
      }
    });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserSql = 'SELECT id, username, email FROM users WHERE username = ? OR email = ?';

    db.query(checkUserSql, [username, email], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 'Database error while checking existing user',
          details: err.message
        });
      }

      if (results.length > 0) {
        const existingUser = results[0];
        const conflict = existingUser.username === username ? 'Username' : 'Email';
        return res.status(409).json({
          error: `${conflict} already exists`,
          field: conflict.toLowerCase()
        });
      }

      const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user account', details: err.message });
        }

        res.status(201).json({
          message: 'Account created successfully! You can now log in.',
          userId: result.insertId,
          username: username
        });
      });
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error during signup', details: error.message });
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ?';

  db.query(sql, [username], async (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Database error during login',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = results[0];

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });

    } catch (bcryptError) {
      res.status(500).json({ error: 'Authentication error' });
    }
  });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}! This is a protected route.`,
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

app.get('/profile', authenticateToken, (req, res) => {
  const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json(results[0]);
  });
});

app.use(express.static(path.join(__dirname)));

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', method: req.method, path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

*/