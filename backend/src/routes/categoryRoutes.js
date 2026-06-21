const { Router } = require('express');
const categoryController = require('../controllers/categoryController');

const router = Router();

router.get('/', categoryController.list);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
