const authRoutes = require('./routes/authRoutes');
const express = require('express');
const app = express();

// Rotas e middlewares adicionais podem ser adicionados aqui pelos desenvolvedores.
app.use(express.json());
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.json({ status: 'online', project: 'GestorIQ' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
