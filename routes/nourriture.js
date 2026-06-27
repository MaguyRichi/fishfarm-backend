const express = require('express');
const router = express.Router();
const nourritureController = require('../controllers/nourritureController');

router.get('/stocks', nourritureController.getStocks);
router.post('/stocks', nourritureController.addStock);
router.put('/stocks/:id', nourritureController.updateStock);
router.delete('/stocks/:id', nourritureController.deleteStock);
router.get('/sessions', nourritureController.getSessions);
router.post('/sessions', nourritureController.addSession);
router.put('/sessions/:id', nourritureController.updateSession);

module.exports = router;