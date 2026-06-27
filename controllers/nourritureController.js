const db = require('../config/database');

exports.getStocks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stocks ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addStock = async (req, res) => {
    const { type, quantite, unite, seuil, statut, joursRestants } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO stocks (type_nourriture, quantite, unite, seuil_alerte, statut, jours_restants)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [type, quantite, unite || 'kg', seuil, statut || 'Bon', joursRestants || 10]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateStock = async (req, res) => {
    const { quantite } = req.body;
    try {
        const result = await db.query(
            `UPDATE stocks SET 
                quantite = $1,
                statut = CASE WHEN $1 < seuil_alerte THEN 'Critique' ELSE 'Bon' END,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $2 RETURNING *`,
            [quantite, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const result = await db.query('DELETE FROM stocks WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock non trouvé' });
        }
        res.json({ message: 'Stock supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getSessions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sessions_nourriture ORDER BY date_session DESC, heure');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addSession = async (req, res) => {
    const { heure, periode, bassin, espece, quantite, typeNourriture, statut } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO sessions_nourriture (heure, periode, bassin_nom, espece, quantite, type_nourriture, statut)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [heure, periode, bassin, espece, quantite, typeNourriture, statut || 'PROGRAMMÉ']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateSession = async (req, res) => {
    const { statut } = req.body;
    try {
        const result = await db.query(
            `UPDATE sessions_nourriture SET statut = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [statut, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Session non trouvée' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};