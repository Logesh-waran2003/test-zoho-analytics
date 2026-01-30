import express from 'express';
import { query } from '../db/index.js';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { tenant_id, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10 } = req.body;

    if (!tenant_id) {
      return res.status(400).json({ error: 'tenant_id is required' });
    }

    await query(
      `INSERT INTO form_data (tenant_id, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [tenant_id, field_1, field_2, field_3, field_4, field_5, field_6, field_7, field_8, field_9, field_10]
    );

    res.json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Form submission error:', error.message);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

export default router;
