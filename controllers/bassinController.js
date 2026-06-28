const db = require('../config/database');

// ✅ DONNÉES MOCKÉES pour le test
const mockBassins = [
    { id: 1, nom: 'Bassin A', espece: 'Tilapia', densite: 2.5, population: 150, statut: 'Optimal', oxygene: 8.5, temperature: 22.0, dernier_repas: '08:00', alerte: false },
    { id: 2, nom: 'Bassin B', espece: 'Sea Bass', densite: 3.0, population: 200, statut: 'Optimal', oxygene: 7.8, temperature: 21.0, dernier_repas: '09:30', alerte: false },
    { id: 3, nom: 'Bassin C', espece: 'Truite Arc-en-ciel', densite: 4.0, population: 120, statut: 'Attention', oxygene: 4.5, temperature: 23.0, dernier_repas: '10:00', alerte: true },
    { id: 4, nom: 'Bassin D', espece: 'Carpe', densite: 2.8, population: 180, statut: 'Optimal', oxygene: 7.2, temperature: 22.5, dernier_repas: '11:00', alerte: false }
];

exports.getAllBassins = async (req, res) => {
    try {
        // ⚠️ COMMENTEZ TEMPORAIREMENT la requête DB
        // const result = await db.query('SELECT * FROM bassins ORDER BY id');
        // res.json(result.rows);
        
        // ✅ UTILISEZ LES DONNÉES MOCKÉES
        res.json(mockBassins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};