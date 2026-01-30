import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db/index.js';
import authRoutes from './routes/auth.js';
import formRoutes from './routes/form.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.set('trust proxy', 1);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/form', formRoutes);
app.use('/dashboard', dashboardRoutes);

const startServer = async () => {
  try {
    await initDB();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
