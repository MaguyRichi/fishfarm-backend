const db = require('../config/database');

exports.getStats = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                COUNT(*) as bassins_actifs,
                COALESCE(SUM(population), 0) as total_poissons,
                COALESCE(AVG(densite), 0) as taux_occupation
             FROM bassins`
        );
        res.json({
            bassinsTotal: result.rows[0]?.bassins_actifs || 0,
            poissonsTotal: result.rows[0]?.total_poissons || 0,
            tauxOccupation: result.rows[0]?.taux_occupation || 0,
            productionJournaliere: 45.2
        });
    } catch (error) {
        console.error('❌ Erreur getStats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getWaterQuality = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                AVG(temperature) as temperature,
                AVG(oxygene) as oxygene,
                AVG(ph) as ph,
                AVG(ammoniac) as ammoniac
             FROM qualite_eau
             WHERE date_mesure >= NOW() - INTERVAL '24 hours'`
        );
        res.json({
            temperature: parseFloat(result.rows[0]?.temperature) || 22.0,
            oxygene: parseFloat(result.rows[0]?.oxygene) || 8.5,
            ph: parseFloat(result.rows[0]?.ph) || 7.2,
            ammoniac: parseFloat(result.rows[0]?.ammoniac) || 0.02
        });
    } catch (error) {
        console.error('❌ Erreur getWaterQuality:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM alertes ORDER BY date_alerte DESC LIMIT 10`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getAlerts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        const poids = await db.query(
            `SELECT AVG(poids_moyen) as poids_moyen FROM echantillonnages ORDER BY date_echantillon DESC LIMIT 5`
        );
        res.json({
            poidsMoyen: parseFloat(poids.rows[0]?.poids_moyen) || 0,
            croissanceJour: 2.3,
            tauxMortalite: 0.05,
            densiteMoyenne: 42.5
        });
    } catch (error) {
        console.error('❌ Erreur getKPIs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};