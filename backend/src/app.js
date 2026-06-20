const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const userRoutes = require('./routes/userRoutes');
const { authenticate } = require('./middlewares/auth');

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({ status: 'online', project: 'GestorIQ' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', authRoutes);
app.use('/api/produtos', authenticate, productRoutes);
app.use('/api/categorias', authenticate, categoryRoutes);
app.use('/api/fornecedores', authenticate, supplierRoutes);
app.use('/api/usuarios', authenticate, userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada.' });
});

module.exports = app;
