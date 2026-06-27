const express = require('express');
const router = express.Router();
const bassinController = require('../controllers/bassinController');

router.get('/', bassinController.getAllBassins);
router.get('/:id', bassinController.getBassinById);
router.post('/', bassinController.createBassin);
router.put('/:id', bassinController.updateBassin);
router.delete('/:id', bassinController.deleteBassin);

module.exports = router;