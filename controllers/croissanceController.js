const db = require('../config/database');

exports.getCroissanceData = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM croissance ORDER BY semaine');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getEchantillonnages = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT e.*, b.nom as bassin_nom 
            FROM echantillonnages e
            LEFT JOIN bassins b ON e.bassin_id = b.id
            ORDER BY e.date_echantillon DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addEchantillonnage = async (req, res) => {
    const { date, poids, ecart, mortalite, statut, bassinId } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO echantillonnages (date_echantillon, poids_moyen, ecart_type, mortalite, statut, bassin_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [date, poids, ecart, mortalite, statut, bassinId || 1]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur addEchantillonnage:', error);
        res.status(500).json({ error: 'Erreur serveur', details: error.message });
    }
};

exports.getCroissanceEspece = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                espece,
                COUNT(*) as nombre_bassins,
                AVG(densite) as densite_moyenne,
                SUM(population) as population_totale
            FROM bassins 
            GROUP BY espece
            ORDER BY population_totale DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur getCroissanceEspece:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.generateRapport = async (req, res) => {
    try {
        // 1. Statistiques générales
        const stats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM bassins) as total_bassins,
                (SELECT SUM(population) FROM bassins) as total_poissons,
                (SELECT AVG(densite) FROM bassins) as densite_moyenne,
                (SELECT COUNT(*) FROM bassins WHERE alerte = true) as bassins_alerte
        `);

        // 2. Croissance par espèce
        const croissanceEspece = await db.query(`
            SELECT 
                espece,
                COUNT(*) as nombre_bassins,
                SUM(population) as population,
                AVG(densite) as densite_moyenne
            FROM bassins 
            GROUP BY espece
            ORDER BY population DESC
        `);

        // 3. Derniers échantillonnages
        const echantillons = await db.query(`
            SELECT * FROM echantillonnages 
            ORDER BY date_echantillon DESC 
            LIMIT 10
        `);

        // 4. Qualité de l'eau moyenne
        const qualiteEau = await db.query(`
            SELECT 
                AVG(temperature) as temp_moyenne,
                AVG(oxygene) as oxygene_moyen,
                AVG(ph) as ph_moyen,
                AVG(ammoniac) as ammoniac_moyen
            FROM qualite_eau 
            WHERE date_mesure >= NOW() - INTERVAL '7 days'
        `);

        // 5. Production de nourriture (7 derniers jours)
        const production = await db.query(`
            SELECT 
                DATE(date_session) as jour,
                SUM(quantite) as total_quantite
            FROM sessions_nourriture 
            WHERE date_session >= NOW() - INTERVAL '7 days'
            GROUP BY DATE(date_session)
            ORDER BY jour DESC
        `);

        const rapport = {
            date: new Date().toISOString(),
            statistiques: stats.rows[0] || {},
            croissanceEspece: croissanceEspece.rows || [],
            echantillonnages: echantillons.rows || [],
            qualiteEau: qualiteEau.rows[0] || {},
            production: production.rows || [],
            totalEchantillons: echantillons.rowCount || 0,
            totalEspeces: croissanceEspece.rowCount || 0
        };

        res.json(rapport);
    } catch (error) {
        console.error('Erreur generateRapport:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.exportData = async (req, res) => {
    try {
        const croissance = await db.query('SELECT * FROM croissance ORDER BY semaine');
        const echantillons = await db.query('SELECT * FROM echantillonnages ORDER BY date_echantillon DESC');
        
        res.json({
            croissance: croissance.rows,
            echantillonnages: echantillons.rows,
            exportedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};