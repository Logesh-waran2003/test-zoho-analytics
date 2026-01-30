import express from 'express';
import { getEmbedUrl } from '../services/zoho.js';
import { query } from '../db/index.js';

const router = express.Router();

router.post('/embed-url', async (req, res) => {
  try {
    const { userId, orgId } = req.body;

    if (!userId || !orgId) {
      return res.status(400).json({ error: 'userId and orgId are required' });
    }

    const result = await query('SELECT * FROM users WHERE user_id = $1 AND org_id = $2', [userId, orgId]);
    
    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'User not authorized' });
    }

    const embedUrl = await getEmbedUrl(userId, orgId);
    
    res.json({ embedUrl });
  } catch (error) {
    console.error('Error generating embed URL:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate embed URL' });
  }
});

export default router;
