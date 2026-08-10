import { createApp } from './app';
import { env } from './config/env';
import { verifyConnection, closeDriver } from './database/driver';

async function startServer() {
  const app = createApp();

  const server = app.listen(env.PORT, async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 TalentGraph Backend Server running on port ${env.PORT}`);
    console.log(`🔗 API Base: http://localhost:${env.PORT}/api`);
    console.log(`🩺 Health Check: http://localhost:${env.PORT}/api/health`);
    console.log(`======================================================\n`);

    // Verify DB connectivity on startup
    const dbStatus = await verifyConnection();
    if (dbStatus.connected) {
      console.log(`✅ [Database] ${dbStatus.message}`);
    } else {
      console.warn(`⚠️ [Database Warning] ${dbStatus.message}`);
      console.warn(`👉 The server will remain alive with degraded status until CognoDB is configured.`);
    }
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await closeDriver();
      console.log('🏁 Server and database connections closed. Bye!');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
