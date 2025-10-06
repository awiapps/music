/**
 * AWMusic API Server
 * Backend for music metadata, user preferences, and streaming
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'AWMusic API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      music: '/api/music',
      search: '/api/search',
      user: '/api/user'
    }
  });
});

// Placeholder routes for future implementation
app.use('/api/music', (req, res) => {
  res.status(501).json({ error: 'Music routes not implemented yet' });
});

app.use('/api/search', (req, res) => {
  res.status(501).json({ error: 'Search routes not implemented yet' });
});

app.use('/api/user', (req, res) => {
  res.status(501).json({ error: 'User routes not implemented yet' });
});

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 AWMusic API server running on port ${PORT}`);
});

export default app;
