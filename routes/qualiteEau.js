const express = require('express');
const router = express.Router();
const qualiteEauController = require('../controllers/qualiteEauController');

router.get('/', qualiteEauController.getAllMesures);
router.post('/', qualiteEauController.addMesure);
router.get('/bassin/:bassinId', qualiteEauController.getMesuresByBassin);

module.exports = router;