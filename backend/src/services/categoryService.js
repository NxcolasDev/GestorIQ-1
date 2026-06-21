const { createCrudService } = require('./crudService');

module.exports = createCrudService({
  table: 'categorias',
  allowedFields: ['nome', 'descricao'],
  requiredFields: ['nome'],
});
