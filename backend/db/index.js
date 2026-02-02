import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({ connectionString });

export { pool };
export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      tenant_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  await query(`
    CREATE TABLE IF NOT EXISTS form_data (
      id SERIAL PRIMARY KEY,
      tenant_id VARCHAR(255) NOT NULL,
      field_1 TEXT,
      field_2 TEXT,
      field_3 TEXT,
      field_4 TEXT,
      field_5 TEXT,
      field_6 TEXT,
      field_7 TEXT,
      field_8 TEXT,
      field_9 TEXT,
      field_10 TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  const { rowCount } = await query('SELECT * FROM users WHERE user_id = $1', ['mock_user']);
  if (rowCount === 0) {
    await query('INSERT INTO users (user_id, tenant_id) VALUES ($1, $2)', ['mock_user', 'tenant_1']);
  }
};
