const { query } = require('../config/database');
const { createCrudService } = require('./crudService');

const productCrud = createCrudService({
  table: 'produtos',
  allowedFields: ['nome', 'descricao', 'preco', 'quantidade_estoque', 'categoria_id'],
  requiredFields: ['nome', 'preco', 'quantidade_estoque', 'categoria_id'],
});

async function listSuppliers(productId) {
  await productCrud.getById(productId);

  const result = await query(
    `SELECT f.id, f.nome, f.cnpj, f.telefone, f.email, f.created_at, f.updated_at
     FROM fornecedores f
     INNER JOIN produto_fornecedor pf ON pf.fornecedor_id = f.id
     WHERE pf.produto_id = $1
     ORDER BY f.id`,
    [productId],
  );

  return result.rows;
}

async function addSupplier(productId, supplierId) {
  await productCrud.getById(productId);
  const supplier = await query('SELECT id FROM fornecedores WHERE id = $1', [supplierId]);

  if (supplier.rowCount === 0) {
    const error = new Error('Fornecedor nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const result = await query(
    `INSERT INTO produto_fornecedor (produto_id, fornecedor_id)
     VALUES ($1, $2)
     ON CONFLICT (produto_id, fornecedor_id) DO NOTHING
     RETURNING produto_id, fornecedor_id, created_at`,
    [productId, supplierId],
  );

  if (result.rowCount === 0) {
    const error = new Error('Associacao ja existente.');
    error.statusCode = 400;
    throw error;
  }

  return result.rows[0];
}

async function removeSupplier(productId, supplierId) {
  const result = await query(
    'DELETE FROM produto_fornecedor WHERE produto_id = $1 AND fornecedor_id = $2',
    [productId, supplierId],
  );

  if (result.rowCount === 0) {
    const error = new Error('Associacao nao encontrada.');
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  ...productCrud,
  listSuppliers,
  addSupplier,
  removeSupplier,
};
