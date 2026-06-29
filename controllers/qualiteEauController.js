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
    const { bassinId, temperature, oxygene, ph, ammoniac } = req.body;
    try {
        // Vérifier que bassinId existe
        const checkBassin = await db.query('SELECT id FROM bassins WHERE id = $1', [bassinId]);
        if (checkBassin.rows.length === 0) {
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        
        // Insérer la mesure
        const result = await db.query(
            `INSERT INTO qualite_eau (bassin_id, date_mesure, temperature, oxygene, ph, ammoniac)
             VALUES ($1, CURRENT_DATE, $2, $3, $4, $5) RETURNING *`,
            [bassinId, temperature || 22.0, oxygene || 7.0, ph || 7.0, ammoniac || 0.02]
        );
        
        // ✅ Mettre à jour l'oxygène, le statut et l'alerte du bassin
        const oxygeneValue = parseFloat(oxygene) || 7.0;
        const alerte = oxygeneValue < 5.0;
        const statut = alerte ? 'Attention' : 'Optimal';
        
        await db.query(
            `UPDATE bassins SET 
                oxygene = $1, 
                alerte = $2,
                statut = $3,
                temperature = $4,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $5`,
            [oxygeneValue, alerte, statut, temperature || 22.0, bassinId]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur addMesure:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
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