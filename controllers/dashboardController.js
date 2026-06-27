const db = require('../config/database');

exports.getStats = async (req, res) => {
    try {
        // Nombre de bassins
        const bassinsCount = await db.query('SELECT COUNT(*) as count FROM bassins');
        
        // Population totale
        const populationTotal = await db.query('SELECT COALESCE(SUM(population), 0) as total FROM bassins');
        
        // Taux d'occupation moyen (densité moyenne)
        const tauxOccupation = await db.query(`
            SELECT COALESCE(AVG(densite), 0) as avg_densite FROM bassins
        `);
        
        // Production journalière (dernières 24h)
        const production = await db.query(`
            SELECT COALESCE(SUM(quantite), 0) as total 
            FROM sessions_nourriture 
            WHERE date_session = CURRENT_DATE
        `);
        
        res.json({
            bassinsTotal: parseInt(bassinsCount.rows[0].count) || 0,
            poissonsTotal: parseInt(populationTotal.rows[0].total) || 0,
            tauxOccupation: parseFloat(tauxOccupation.rows[0].avg_densite) || 0,
            productionJournaliere: parseFloat(production.rows[0].total) || 0
        });
    } catch (error) {
        console.error('Erreur getStats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getWaterQuality = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COALESCE(AVG(temperature), 22.0) as temperature,
                COALESCE(AVG(oxygene), 8.5) as oxygene,
                COALESCE(AVG(ph), 7.2) as ph,
                COALESCE(AVG(ammoniac), 0.02) as ammoniac
            FROM qualite_eau 
            WHERE date_mesure >= NOW() - INTERVAL '24 hours'
        `);
        res.json(result.rows[0] || { temperature: 22.0, oxygene: 8.5, ph: 7.2, ammoniac: 0.02 });
    } catch (error) {
        console.error('Erreur getWaterQuality:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM alertes 
            WHERE resolved = false 
            ORDER BY date_alerte DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getAlerts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        // Dernier poids moyen
        const poidsMoyen = await db.query(`
            SELECT poids_moyen FROM echantillonnages 
            ORDER BY date_echantillon DESC LIMIT 1
        `);
        
        // Taux de croissance
        const croissance = await db.query(`
            SELECT AVG(poids_reel - LAG(poids_reel) OVER (ORDER BY semaine)) as taux
            FROM croissance
        `);
        
        // FCR (Food Conversion Ratio)
        const fcr = await db.query(`
            SELECT 
                COALESCE(SUM(quantite), 0) / NULLIF((
                    SELECT SUM(poids_reel) FROM croissance 
                    WHERE semaine >= (SELECT MAX(semaine) - 4 FROM croissance)
                ), 0) as fcr
            FROM sessions_nourriture
        `);
        
        res.json({
            poidsMoyen: poidsMoyen.rows[0]?.poids_moyen ? parseFloat(poidsMoyen.rows[0].poids_moyen) : 0,
            croissanceJour: croissance.rows[0]?.taux ? parseFloat(croissance.rows[0].taux) : 0,
            fcr: fcr.rows[0]?.fcr ? parseFloat(fcr.rows[0].fcr) : 1.12
        });
    } catch (error) {
        console.error('Erreur getKPIs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

function parseFloat(value) {
    return typeof value === 'string' ? parseFloat(value) : value;
}