const db = require('../config/database');

exports.getStats = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                COUNT(*) as bassinsTotal,
                COALESCE(SUM(population), 0) as poissonsTotal,
                COALESCE(AVG(densite), 0) as tauxOccupation,
                45.2 as productionJournaliere
             FROM bassins`
        );
        
        // ✅ Limiter le taux d'occupation à 100% max
        if (result.rows[0]) {
            let tauxOccupation = parseFloat(result.rows[0].tauxoccupation) || 0;
            // Capacité maximale estimée à 50 kg/m³
            const capaciteMax = 50;
            tauxOccupation = (tauxOccupation / capaciteMax) * 100;
            if (tauxOccupation > 100) tauxOccupation = 100;
            if (tauxOccupation < 0) tauxOccupation = 0;
            result.rows[0].tauxoccupation = tauxOccupation;
        }
        
        res.json(result.rows[0] || {
            bassinsTotal: 0,
            poissonsTotal: 0,
            tauxOccupation: 0,
            productionJournaliere: 45.2
        });
    } catch (error) {
        console.error('❌ Erreur getStats:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getWaterQuality = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                COALESCE(AVG(temperature), 22.0) as temperature,
                COALESCE(AVG(oxygene), 7.0) as oxygene,
                COALESCE(AVG(ph), 7.0) as ph,
                COALESCE(AVG(ammoniac), 0.02) as ammoniac
             FROM qualite_eau
             WHERE date_mesure >= NOW() - INTERVAL '24 hours'`
        );
        res.json(result.rows[0] || {
            temperature: 22.0,
            oxygene: 7.0,
            ph: 7.0,
            ammoniac: 0.02
        });
    } catch (error) {
        console.error('❌ Erreur getWaterQuality:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        // ✅ Récupérer les alertes réelles depuis la base
        const result = await db.query(
            `SELECT 
                a.id,
                a.type_alerte,
                a.niveau,
                a.bassin_nom,
                a.valeur,
                a.seuil,
                a.description,
                a.date_alerte,
                a.resolved
             FROM alertes a
             WHERE (a.resolved = false OR a.resolved IS NULL)
             ORDER BY a.date_alerte DESC
             LIMIT 10`
        );
        
        // Si aucune alerte en base, générer des alertes dynamiques
        if (result.rows.length === 0) {
            const alerts = [];
            
            // Vérifier les bassins avec oxygène critique (< 5.0 mg/L)
            const bassinsCritiques = await db.query(
                `SELECT id, nom, oxygene FROM bassins WHERE oxygene < 5.0`
            );
            
            bassinsCritiques.rows.forEach(bassin => {
                alerts.push({
                    type_alerte: 'Oxygène',
                    niveau: 'Alerte',
                    bassin_nom: bassin.nom,
                    valeur: parseFloat(bassin.oxygene),
                    seuil: 5.0,
                    description: `Niveau d'oxygène bas (${parseFloat(bassin.oxygene).toFixed(1)} mg/L)`,
                    date_alerte: new Date().toISOString().split('T')[0],
                    resolved: false
                });
            });
            
            // Vérifier les températures élevées (> 26°C)
            const bassinsChauds = await db.query(
                `SELECT id, nom, temperature FROM bassins WHERE temperature > 26.0`
            );
            
            bassinsChauds.rows.forEach(bassin => {
                alerts.push({
                    type_alerte: 'Température',
                    niveau: 'Alerte',
                    bassin_nom: bassin.nom,
                    valeur: parseFloat(bassin.temperature),
                    seuil: 26.0,
                    description: `Température élevée (${parseFloat(bassin.temperature).toFixed(1)}°C)`,
                    date_alerte: new Date().toISOString().split('T')[0],
                    resolved: false
                });
            });
            
            // Vérifier le pH hors norme (< 6.5 ou > 8.5)
            const bassinsPH = await db.query(
                `SELECT q.bassin_id, b.nom, q.ph 
                 FROM qualite_eau q
                 JOIN bassins b ON q.bassin_id = b.id
                 WHERE q.ph < 6.5 OR q.ph > 8.5
                 ORDER BY q.date_mesure DESC
                 LIMIT 5`
            );
            
            bassinsPH.rows.forEach(phMesure => {
                const niveau = parseFloat(phMesure.ph) < 6.5 ? 'Bas' : 'Élevé';
                alerts.push({
                    type_alerte: 'pH',
                    niveau: 'Alerte',
                    bassin_nom: phMesure.nom,
                    valeur: parseFloat(phMesure.ph),
                    seuil: 7.0,
                    description: `pH ${niveau} (${parseFloat(phMesure.ph).toFixed(1)})`,
                    date_alerte: new Date().toISOString().split('T')[0],
                    resolved: false
                });
            });
            
            return res.json(alerts);
        }
        
        res.json(result.rows);
    } catch (error) {
        console.error('❌ Erreur getAlerts:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getKPIs = async (req, res) => {
    try {
        const poids = await db.query(
            `SELECT AVG(poids_moyen) as poids_moyen FROM echantillonnages ORDER BY date_echantillon DESC LIMIT 5`
        );
        res.json({
            poidsMoyen: parseFloat(poids.rows[0]?.poids_moyen) || 0,
            croissanceJour: 2.3,
            tauxMortalite: 0.05,
            densiteMoyenne: 42.5
        });
    } catch (error) {
        console.error('❌ Erreur getKPIs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};