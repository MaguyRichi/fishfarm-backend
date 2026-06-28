const db = require('../config/database');

exports.getStocks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stocks ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getStocks:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addStock = async (req, res) => {
    const { type_nourriture, quantite, unite, statut, seuil_alerte, jours_restants } = req.body;
    try {
        // ✅ Limiter la quantité
        let quantiteValue = parseFloat(quantite) || 0;
        if (quantiteValue < 0) quantiteValue = 0;
        
        const result = await db.query(
            `INSERT INTO stocks (type_nourriture, quantite, unite, statut, seuil_alerte, jours_restants)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                type_nourriture || 'Nourriture', 
                quantiteValue, 
                unite || 'kg', 
                statut || 'Bon', 
                seuil_alerte || 50, 
                jours_restants || 10
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur addStock:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateStock = async (req, res) => {
    const { type_nourriture, quantite, unite, statut, seuil_alerte, jours_restants } = req.body;
    try {
        // ✅ Limiter la quantité
        let quantiteValue = parseFloat(quantite);
        if (quantiteValue < 0) quantiteValue = 0;
        
        const result = await db.query(
            `UPDATE stocks SET 
                type_nourriture = COALESCE($1, type_nourriture),
                quantite = COALESCE($2, quantite),
                unite = COALESCE($3, unite),
                statut = COALESCE($4, statut),
                seuil_alerte = COALESCE($5, seuil_alerte),
                jours_restants = COALESCE($6, jours_restants)
             WHERE id = $7 RETURNING *`,
            [type_nourriture, quantiteValue, unite, statut, seuil_alerte, jours_restants, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur updateStock:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM stocks WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock non trouvé' });
        }
        res.json({ message: 'Stock supprimé' });
    } catch (error) {
        console.error('❌ Erreur deleteStock:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sessions_nourriture ORDER BY date_session DESC, heure');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getSessions:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addSession = async (req, res) => {
    const { heure, periode, bassin_nom, espece, quantite, type_nourriture, statut, date_session } = req.body;
    try {
        // ✅ Limiter la quantité
        let quantiteValue = parseFloat(quantite) || 0;
        if (quantiteValue < 0) quantiteValue = 0;
        
        const result = await db.query(
            `INSERT INTO sessions_nourriture (heure, periode, bassin_nom, espece, quantite, type_nourriture, statut, date_session)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                heure || '12:00', 
                periode || 'MIDI', 
                bassin_nom || 'Bassin', 
                espece || 'Poisson', 
                quantiteValue, 
                type_nourriture || 'Standard', 
                statut || 'PROGRAMMÉ',
                date_session || new Date().toISOString().split('T')[0]
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur addSession:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateSession = async (req, res) => {
    const { heure, periode, bassin_nom, espece, quantite, type_nourriture, statut, date_session } = req.body;
    try {
        // ✅ Limiter la quantité
        let quantiteValue = parseFloat(quantite);
        if (quantiteValue < 0) quantiteValue = 0;
        
        const result = await db.query(
            `UPDATE sessions_nourriture SET 
                heure = COALESCE($1, heure),
                periode = COALESCE($2, periode),
                bassin_nom = COALESCE($3, bassin_nom),
                espece = COALESCE($4, espece),
                quantite = COALESCE($5, quantite),
                type_nourriture = COALESCE($6, type_nourriture),
                statut = COALESCE($7, statut),
                date_session = COALESCE($8, date_session)
             WHERE id = $9 RETURNING *`,
            [heure, periode, bassin_nom, espece, quantiteValue, type_nourriture, statut, date_session, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Session non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur updateSession:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};