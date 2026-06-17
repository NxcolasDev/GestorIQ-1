require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Banco de dados conectado com sucesso.');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
      console.log('Models sincronizados com o banco de dados.');
    }

    app.listen(PORT, () => {
      console.log(`Servidor iniciado em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

startServer();