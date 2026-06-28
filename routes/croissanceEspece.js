const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ✅ Route simplifiée qui utilise directement la table 'bassins'
router.get('/', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                espece, 
                COUNT(*) AS nombre_bassins, 
                COALESCE(SUM(population), 0) AS population
             FROM bassins 
             WHERE espece IS NOT NULL
             GROUP BY espece
             ORDER BY espece`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur croissance-espece:', error.message);
        res.json([]); // Retourne un tableau vide en cas d'erreur
    }
});

module.exports = router;