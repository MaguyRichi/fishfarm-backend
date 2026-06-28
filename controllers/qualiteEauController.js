const db = require('../config/database');

exports.getAllMesures = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM qualite_eau ORDER BY date_mesure DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getAllMesures:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addMesure = async (req, res) => {
    const { bassin_id, temperature, oxygene, ph, ammoniac } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO qualite_eau (bassin_id, date_mesure, temperature, oxygene, ph, ammoniac)
             VALUES ($1, CURRENT_DATE, $2, $3, $4, $5) RETURNING *`,
            [bassin_id, temperature, oxygene, ph, ammoniac]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur addMesure:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getMesuresByBassin = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM qualite_eau WHERE bassin_id = $1 ORDER BY date_mesure DESC',
            [req.params.bassinId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getMesuresByBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};