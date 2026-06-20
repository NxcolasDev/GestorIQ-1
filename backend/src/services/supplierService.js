const { createCrudService } = require('./crudService');

module.exports = createCrudService({
  table: 'fornecedores',
  allowedFields: ['nome', 'cnpj', 'telefone', 'email'],
  requiredFields: ['nome', 'cnpj'],
});
