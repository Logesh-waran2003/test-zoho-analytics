import express from 'express';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const mockUser = {
      user_id: 'mock_user',
      tenant_id: 'tenant_1',
      token: 'mock_jwt_token'
    };
    
    res.json(mockUser);
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
