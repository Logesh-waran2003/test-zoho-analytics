import express from 'express';
import { getEmbedUrl, getZohoRedirectUrl } from '../services/zoho.js';
import { query } from '../db/index.js';

const router = express.Router();

router.get('/embed-url', async (req, res) => {
  try {
    const { tenant_id } = req.query;

    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    const result = await query('SELECT * FROM users WHERE tenant_id = $1', [tenant_id]);
    
    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Tenant not authorized' });
    }

    const embedUrl = await getEmbedUrl(tenant_id);
    
    res.json({ embedUrl });
  } catch (error) {
    console.error('Error generating embed URL:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate embed URL' });
  }
});

router.get('/zoho-redirect-url', async (req, res) => {
  try {
    const { tenant_id } = req.query;

    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    const result = await query('SELECT * FROM users WHERE tenant_id = $1', [tenant_id]);
    
    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Tenant not authorized' });
    }

    const redirectUrl = await getZohoRedirectUrl(tenant_id);
    
    res.json({ redirectUrl });
  } catch (error) {
    console.error('Error generating redirect URL:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate redirect URL' });
  }
});

export default router;
