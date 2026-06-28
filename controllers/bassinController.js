const db = require('../config/database');

exports.getAllBassins = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bassins ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getAllBassins:', error);
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
        console.error('❌ Erreur getBassinById:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createBassin = async (req, res) => {
    const { nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte } = req.body;
    try {
        // ✅ Limiter la densité pour éviter numeric field overflow (max 999.99)
        let densiteValue = parseFloat(densite) || 0;
        if (densiteValue > 999.99) densiteValue = 999.99;
        if (densiteValue < 0) densiteValue = 0;
        
        // ✅ Limiter la population (max 999999)
        let populationValue = parseInt(population) || 0;
        if (populationValue > 999999) populationValue = 999999;
        if (populationValue < 0) populationValue = 0;
        
        const result = await db.query(
            `INSERT INTO bassins (nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                nom || 'Bassin', 
                espece || 'Tilapia', 
                densiteValue, 
                populationValue, 
                statut || 'Optimal', 
                oxygene || 7.0, 
                temperature || 22.0, 
                dernier_repas || '--:--', 
                alerte || false
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur createBassin:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

exports.updateBassin = async (req, res) => {
    const { nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte } = req.body;
    try {
        let updateAlerte = alerte;
        let updateStatut = statut;
        
        // ✅ Si l'oxygène est modifié, mettre à jour l'alerte automatiquement
        if (oxygene !== undefined) {
            const oxygeneValue = parseFloat(oxygene) || 0;
            updateAlerte = oxygeneValue < 5.0;
            updateStatut = updateAlerte ? 'Attention' : 'Optimal';
        }
        
        // ✅ Limiter la densité
        let densiteValue = parseFloat(densite);
        if (densiteValue > 999.99) densiteValue = 999.99;
        if (densiteValue < 0) densiteValue = 0;
        
        // ✅ Limiter la population
        let populationValue = parseInt(population);
        if (populationValue > 999999) populationValue = 999999;
        if (populationValue < 0) populationValue = 0;
        
        const result = await db.query(
            `UPDATE bassins SET 
                nom = COALESCE($1, nom),
                espece = COALESCE($2, espece),
                densite = COALESCE($3, densite),
                population = COALESCE($4, population),
                statut = COALESCE($5, statut),
                oxygene = COALESCE($6, oxygene),
                temperature = COALESCE($7, temperature),
                dernier_repas = COALESCE($8, dernier_repas),
                alerte = COALESCE($9, alerte),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $10 RETURNING *`,
            [
                nom, 
                espece, 
                densiteValue || null, 
                populationValue || null, 
                updateStatut || statut, 
                oxygene, 
                temperature, 
                dernier_repas, 
                updateAlerte, 
                req.params.id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur updateBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteBassin = async (req, res) => {
    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('DELETE FROM qualite_eau WHERE bassin_id = $1', [req.params.id]);
        const result = await client.query('DELETE FROM bassins WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        await client.query('COMMIT');
        res.json({ message: 'Bassin et ses mesures supprimés avec succès' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Erreur deleteBassin:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    } finally {
        client.release();
    }
};