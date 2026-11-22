import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  🚀 OpenBench Production API Server Running!
  ==========================================
  URL:         http://localhost:${PORT}
  Environment: ${env.NODE_ENV}
  HealthCheck: http://localhost:${PORT}/api/health
  Client:      ${env.CLIENT_URL}
  `);
});
