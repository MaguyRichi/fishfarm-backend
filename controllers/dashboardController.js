const db = require('../config/database');

exports.getStats = async (req, res) => {
    try {
        // const result = await db.query('SELECT COUNT(*) as total, SUM(population) as poissons FROM bassins');
        // const stats = result.rows[0];
        const stats = {
            bassinsTotal: 4,
            poissonsTotal: 650,
            tauxOccupation: 85,
            productionJournaliere: 45.2
        };
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getWaterQuality = async (req, res) => {
    try {
        const qualite = {
            temperature: 22.0,
            oxygene: 8.5,
            ph: 7.2,
            ammoniac: 0.02
        };
        res.json(qualite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = [
            { type_alerte: 'Température', niveau: 'Alerte', bassin_nom: 'Bassin C', valeur: 23, seuil: 22, description: 'Température élevée', date_alerte: '2026-06-22' }
        ];
        res.json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        const kpis = {
            poidsMoyen: 145.5,
            croissanceJour: 2.3,
            tauxMortalite: 0.05,
            densiteMoyenne: 42.5
        };
        res.json(kpis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};