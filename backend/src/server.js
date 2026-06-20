require('dotenv').config();
const app = require('./app');
const { initializeDatabase } = require('./config/database');
const PORT = process.env.PORT || 3000;

async function start() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
