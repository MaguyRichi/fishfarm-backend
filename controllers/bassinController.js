exports.createBassin = async (req, res) => {
    const { nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte } = req.body;
    try {
        // ✅ LIMITER LA DENSITÉ À 999.99 MAX
        let densiteValue = parseFloat(densite) || 0;
        if (densiteValue > 999.99) densiteValue = 999.99;
        if (densiteValue < 0) densiteValue = 0;
        
        const result = await db.query(
            `INSERT INTO bassins (nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                nom || 'Bassin', 
                espece || 'Tilapia', 
                densiteValue, 
                population || 0, 
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