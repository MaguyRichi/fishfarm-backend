const db = require('../config/database');

exports.getAllBassins = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bassins ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getBassinById = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bassins WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createBassin = async (req, res) => {
    const { nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO bassins (nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nom, espece, densite, population, statut || 'Optimal', oxygene || 7.0, temperature || 22.0, dernier_repas || '--:--', alerte || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateBassin = async (req, res) => {
    const { nom, densite, statut, oxygene, temperature, alerte } = req.body;
    try {
        // Si l'oxygène est modifié, mettre à jour l'alerte automatiquement
        let updateAlerte = alerte;
        let updateStatut = statut;
        
        if (oxygene !== undefined) {
            updateAlerte = parseFloat(oxygene) < 5.0;
            updateStatut = updateAlerte ? 'Attention' : 'Optimal';
        }
        
        const result = await db.query(
            `UPDATE bassins SET 
                nom = COALESCE($1, nom),
                densite = COALESCE($2, densite),
                statut = COALESCE($3, statut),
                oxygene = COALESCE($4, oxygene),
                temperature = COALESCE($5, temperature),
                alerte = COALESCE($6, alerte),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING *`,
            [nom, densite, updateStatut || statut, oxygene, temperature, updateAlerte, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur updateBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteBassin = async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        
        // Supprimer les mesures de qualité d'eau associées
        await client.query('DELETE FROM qualite_eau WHERE bassin_id = $1', [req.params.id]);
        
        // Supprimer le bassin
        const result = await client.query('DELETE FROM bassins WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        
        await client.query('COMMIT');
        res.json({ message: 'Bassin et ses mesures supprimés avec succès' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Erreur deleteBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        client.release();
    }
};