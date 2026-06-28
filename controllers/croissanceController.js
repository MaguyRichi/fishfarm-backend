exports.addEchantillonnage = async (req, res) => {
    // ✅ RÉCUPÉRER LE BON NOM DE CHAMP
    const { date, date_echantillon, poids, ecart, mortalite, statut, bassinId } = req.body;
    const dateValue = date || date_echantillon || new Date().toISOString().split('T')[0];
    
    try {
        const result = await db.query(
            `INSERT INTO echantillonnages (date_echantillon, bassin_id, poids_moyen, ecart_type, mortalite, statut)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                dateValue,
                bassinId || 1,
                poids || 0,
                ecart || 0,
                mortalite || 0,
                statut || 'Optimal'
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur addEchantillonnage:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};