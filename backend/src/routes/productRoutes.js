const { Router } = require('express');
const productController = require('../controllers/productController');

const router = Router();

router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/fornecedores', productController.listSuppliers);
router.post('/:id/fornecedores', productController.addSupplier);
router.delete('/:id/fornecedores/:fornecedor_id', productController.removeSupplier);

module.exports = router;
