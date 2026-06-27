const db = require('../config/database');

exports.getAllMesures = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT q.*, b.nom as bassin_nom 
            FROM qualite_eau q
            LEFT JOIN bassins b ON q.bassin_id = b.id
            ORDER BY q.date_mesure DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getAllMesures:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getMesuresByBassin = async (req, res) => {
    try {
        const bassinId = req.params.bassinId;
        const result = await db.query(`
            SELECT * FROM qualite_eau 
            WHERE bassin_id = $1 
            ORDER BY date_mesure DESC
        `, [bassinId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getMesuresByBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addMesure = async (req, res) => {
    const { bassinId, temperature, oxygene, ph, ammoniac } = req.body;
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        // Insérer la mesure
        const result = await client.query(
            `INSERT INTO qualite_eau (bassin_id, temperature, oxygene, ph, ammoniac, date_mesure)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [bassinId, temperature, oxygene, ph, ammoniac]
        );
        
        // Mettre à jour le statut d'alerte du bassin
        // Alerte si oxygène < 5.0 mg/L
        const isAlerte = parseFloat(oxygene) < 5.0;
        const statut = isAlerte ? 'Attention' : 'Optimal';
        
        await client.query(
            `UPDATE bassins SET 
                oxygene = $1,
                temperature = $2,
                alerte = $3,
                statut = $4,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $5`,
            [oxygene, temperature, isAlerte, statut, bassinId]
        );
        
        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur addMesure:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    } finally {
        client.release();
    }
};