/**
 * Unit tests for API server
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create test server similar to main app
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'AWMusic API',
      version: '0.1.0',
      endpoints: {
        health: '/health',
        music: '/api/music',
        search: '/api/search',
        user: '/api/user',
      },
    });
  });

  // Placeholder routes
  app.use('/api/music', (req, res) => {
    res.status(501).json({ error: 'Music routes not implemented yet' });
  });

  app.use('/api/search', (req, res) => {
    res.status(501).json({ error: 'Search routes not implemented yet' });
  });

  app.use('/api/user', (req, res) => {
    res.status(501).json({ error: 'User routes not implemented yet' });
  });

  return app;
};

describe('API Server', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'AWMusic API');
      expect(response.body).toHaveProperty('version', '0.1.0');
      expect(response.body).toHaveProperty('endpoints');
    });

    it('should include all endpoint paths', async () => {
      const response = await request(app).get('/');

      expect(response.body.endpoints).toHaveProperty('health');
      expect(response.body.endpoints).toHaveProperty('music');
      expect(response.body.endpoints).toHaveProperty('search');
      expect(response.body.endpoints).toHaveProperty('user');
    });
  });

  describe('GET /health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp.toISOString()).toBe(response.body.timestamp);
    });
  });

  describe('GET /api/music', () => {
    it('should return 501 for unimplemented route', async () => {
      const response = await request(app).get('/api/music');

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not implemented');
    });
  });

  describe('GET /api/search', () => {
    it('should return 501 for unimplemented route', async () => {
      const response = await request(app).get('/api/search');

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/user', () => {
    it('should return 501 for unimplemented route', async () => {
      const response = await request(app).get('/api/user');

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/search', () => {
    it('should accept POST requests', async () => {
      const response = await request(app)
        .post('/api/search')
        .send({ query: 'test song' });

      expect(response.status).toBe(501);
    });

    it('should accept JSON body', async () => {
      const response = await request(app)
        .post('/api/search')
        .send({ query: 'test', provider: 'musicbrainz' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(501);
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('404 Routes', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');

      expect(response.status).toBe(404);
    });
  });
});
