const db = require('../config/database');

// ✅ DONNÉES MOCKÉES UNIQUEMENT
const mockCroissance = [
    { semaine: 1, poids_reel: 100, poids_industriel: 95 },
    { semaine: 2, poids_reel: 110, poids_industriel: 108 },
    { semaine: 3, poids_reel: 120, poids_industriel: 115 },
    { semaine: 4, poids_reel: 130, poids_industriel: 125 },
    { semaine: 5, poids_reel: 145, poids_industriel: 138 }
];

const mockEchantillons = [
    { id: 1, date_echantillon: '2026-06-20', poids_moyen: 120, ecart_type: 5.2, mortalite: 0.02, statut: 'Optimal', bassin_id: 1 },
    { id: 2, date_echantillon: '2026-06-21', poids_moyen: 125, ecart_type: 4.8, mortalite: 0.01, statut: 'Optimal', bassin_id: 1 },
    { id: 3, date_echantillon: '2026-06-22', poids_moyen: 130, ecart_type: 6.1, mortalite: 0.15, statut: 'Alerte', bassin_id: 2 }
];

exports.getCroissanceData = (req, res) => {
    try {
        res.json(mockCroissance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getEchantillonnages = (req, res) => {
    try {
        res.json(mockEchantillons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addEchantillonnage = (req, res) => {
    try {
        const newEchantillon = { id: mockEchantillons.length + 1, ...req.body };
        mockEchantillons.push(newEchantillon);
        res.status(201).json(newEchantillon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getCroissanceEspece = (req, res) => {
    try {
        const especes = [
            { espece: 'Tilapia', population: 150, nombre_bassins: 1 },
            { espece: 'Sea Bass', population: 200, nombre_bassins: 1 },
            { espece: 'Truite Arc-en-ciel', population: 120, nombre_bassins: 1 },
            { espece: 'Carpe', population: 180, nombre_bassins: 1 }
        ];
        res.json(especes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.generateRapport = (req, res) => {
    try {
        const rapport = {
            date: new Date().toISOString(),
            statistiques: {
                total_bassins: 4,
                total_poissons: 650,
                densite_moyenne: 45.2,
                bassins_alerte: 1
            },
            croissanceEspece: [
                { espece: 'Tilapia', population: 150, nombre_bassins: 1 },
                { espece: 'Sea Bass', population: 200, nombre_bassins: 1 },
                { espece: 'Truite Arc-en-ciel', population: 120, nombre_bassins: 1 },
                { espece: 'Carpe', population: 180, nombre_bassins: 1 }
            ],
            qualiteEau: {
                temp_moyenne: 21.5,
                oxygene_moyen: 7.8,
                ph_moyen: 7.2,
                ammoniac_moyen: 0.025
            }
        };
        res.json(rapport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.exportData = (req, res) => {
    try {
        res.json({ message: 'Exportation réussie', format: 'PDF' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};