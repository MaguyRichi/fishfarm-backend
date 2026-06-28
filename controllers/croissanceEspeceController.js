const db = require('../config/database');

exports.getCroissanceEspece = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                espece, 
                COUNT(*) as nombre_bassins, 
                SUM(population) as population,
                AVG(poids_moyen) as poids_moyen,
                AVG(taux_croissance) as taux_croissance
             FROM bassins b
             LEFT JOIN echantillonnages e ON b.id = e.bassin_id
             GROUP BY espece`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getCroissanceEspece:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};