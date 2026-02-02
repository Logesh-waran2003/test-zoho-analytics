import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE user_id = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const tenantId = `tenant_${uuidv4().split('-')[0]}`;
    
    // Insert user
    await pool.query(
      'INSERT INTO users (user_id, tenant_id, password, name) VALUES ($1, $2, $3, $4)',
      [email, tenantId, hashedPassword, name || email]
    );
    
    // Generate JWT
    const token = jwt.sign(
      { user_id: email, tenant_id: tenantId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      user_id: email,
      tenant_id: tenantId,
      name: name || email,
      token
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { user_id: user.user_id, tenant_id: user.tenant_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      user_id: user.user_id,
      tenant_id: user.tenant_id,
      name: user.name,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
