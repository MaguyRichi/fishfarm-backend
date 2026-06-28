const db = require('../config/database');

exports.getCroissanceEspece = async (req, res) => {
    try {
        // Requête SQL simplifiée et robuste
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
        console.error('❌ Erreur getCroissanceEspece:', error.message);
        // En cas d'erreur, on renvoie un tableau vide pour ne pas bloquer l'app
        res.status(200).json([]);
    }
};