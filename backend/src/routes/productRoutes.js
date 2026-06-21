const { Router } = require('express');
const productController = require('../controllers/productController');

const router = Router();

router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
