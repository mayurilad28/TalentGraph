import express from 'express';
import cors from 'cors';
import candidateRoutes from './routes/candidateRoutes';
import jobRoutes from './routes/jobRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import graphRoutes from './routes/graphRoutes';
import { verifyConnection } from './database/driver';
import { errorHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', async (_req, res) => {
    const dbStatus = await verifyConnection();
    res.status(dbStatus.connected ? 200 : 503).json({
      status: dbStatus.connected ? 'healthy' : 'degraded',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      service: 'talentgraph-backend',
    });
  });

  // REST API Routes
  app.use('/api/candidates', candidateRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/graph', graphRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      data: null,
      error: { message: `Endpoint '${req.method} ${req.originalUrl}' not found` },
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
