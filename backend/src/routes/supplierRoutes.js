const { Router } = require('express');
const supplierController = require('../controllers/supplierController');

const router = Router();

router.get('/', supplierController.list);
router.get('/:id', supplierController.getById);
router.post('/', supplierController.create);
router.put('/:id', supplierController.update);
router.delete('/:id', supplierController.remove);

module.exports = router;
