const express = require('express');
const router = express.Router();
const croissanceController = require('../controllers/croissanceController');

router.get('/', croissanceController.getCroissanceData);
router.get('/echantillons', croissanceController.getEchantillonnages);
router.post('/echantillons', croissanceController.addEchantillonnage);
router.get('/espece', croissanceController.getCroissanceEspece);
router.get('/rapport', croissanceController.generateRapport);
router.post('/export', croissanceController.exportData);

module.exports = router;