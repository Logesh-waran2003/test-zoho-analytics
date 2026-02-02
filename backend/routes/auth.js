import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/index.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/login', async (req, res) => {
  try {
    // Generate unique IDs for demo user
    const userId = `user_${uuidv4().split('-')[0]}`;
    const tenantId = `tenant_${uuidv4().split('-')[0]}`;
    
    // Insert user into database
    await pool.query(
      'INSERT INTO users (user_id, tenant_id) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
      [userId, tenantId]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { user_id: userId, tenant_id: tenantId },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      user_id: userId,
      tenant_id: tenantId,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
