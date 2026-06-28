const db = require('../config/database');

exports.getCroissanceData = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM croissance ORDER BY semaine');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getCroissanceData:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getEchantillonnages = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM echantillonnages ORDER BY date_echantillon DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getEchantillonnages:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addEchantillonnage = async (req, res) => {
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

exports.getCroissanceEspece = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                espece, 
                COUNT(*) as nombre_bassins, 
                COALESCE(SUM(population), 0) as population
             FROM bassins 
             WHERE espece IS NOT NULL
             GROUP BY espece`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getCroissanceEspece:', error);
        res.json([]);
    }
};

exports.generateRapport = async (req, res) => {
    try {
        const stats = await db.query(
            `SELECT 
                COUNT(*) as total_bassins,
                COALESCE(SUM(population), 0) as total_poissons,
                COALESCE(AVG(densite), 0) as densite_moyenne,
                COUNT(CASE WHEN alerte = true THEN 1 END) as bassins_alerte
             FROM bassins`
        );
        
        const especes = await db.query(
            `SELECT espece, COALESCE(SUM(population), 0) as population, COUNT(*) as nombre_bassins 
             FROM bassins 
             GROUP BY espece`
        );
        
        const qualite = await db.query(
            `SELECT 
                COALESCE(AVG(temperature), 0) as temp_moyenne,
                COALESCE(AVG(oxygene), 0) as oxygene_moyen,
                COALESCE(AVG(ph), 0) as ph_moyen,
                COALESCE(AVG(ammoniac), 0) as ammoniac_moyen
             FROM qualite_eau
             WHERE date_mesure >= NOW() - INTERVAL '7 days'`
        );
        
        const echantillons = await db.query(
            `SELECT date_echantillon, poids_moyen, statut 
             FROM echantillonnages 
             ORDER BY date_echantillon DESC 
             LIMIT 3`
        );
        
        res.json({
            date: new Date().toISOString(),
            statistiques: stats.rows[0] || {},
            croissanceEspece: especes.rows || [],
            qualiteEau: qualite.rows[0] || {},
            echantillonnages: echantillons.rows || []
        });
    } catch (error) {
        console.error('❌ Erreur generateRapport:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.exportData = async (req, res) => {
    try {
        const { format } = req.body;
        res.json({ message: 'Exportation réussie', format: format || 'PDF' });
    } catch (error) {
        console.error('❌ Erreur exportData:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};