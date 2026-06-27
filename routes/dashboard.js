const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/water-quality', dashboardController.getWaterQuality);
router.get('/alerts', dashboardController.getAlerts);
router.get('/kpis', dashboardController.getKPIs);

module.exports = router;