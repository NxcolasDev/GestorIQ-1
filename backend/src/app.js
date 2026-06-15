const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger');
const productRoutes = require('./routes/productRoutes');
const app = express();

// Rotas e middlewares adicionais podem ser adicionados aqui pelos desenvolvedores.
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/produtos', productRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'online', project: 'GestorIQ' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
