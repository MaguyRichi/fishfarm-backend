//const db = require('../config/database');

// ✅ DONNÉES MOCKÉES UNIQUEMENT - PAS DE DB
const mockBassins = [
    { id: 1, nom: 'Bassin A', espece: 'Tilapia', densite: 2.5, population: 150, statut: 'Optimal', oxygene: 8.5, temperature: 22.0, dernier_repas: '08:00', alerte: false },
    { id: 2, nom: 'Bassin B', espece: 'Sea Bass', densite: 3.0, population: 200, statut: 'Optimal', oxygene: 7.8, temperature: 21.0, dernier_repas: '09:30', alerte: false },
    { id: 3, nom: 'Bassin C', espece: 'Truite Arc-en-ciel', densite: 4.0, population: 120, statut: 'Attention', oxygene: 4.5, temperature: 23.0, dernier_repas: '10:00', alerte: true },
    { id: 4, nom: 'Bassin D', espece: 'Carpe', densite: 2.8, population: 180, statut: 'Optimal', oxygene: 7.2, temperature: 22.5, dernier_repas: '11:00', alerte: false }
];

exports.getAllBassins = (req, res) => {
    try {
        res.json(mockBassins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getBassinById = (req, res) => {
    try {
        const bassin = mockBassins.find(b => b.id === parseInt(req.params.id));
        if (!bassin) {
            return res.status(404).json({ error: 'Bassin non trouvé' });
        }
        res.json(bassin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.createBassin = (req, res) => {
    try {
        const newBassin = { id: mockBassins.length + 1, ...req.body };
        mockBassins.push(newBassin);
        res.status(201).json(newBassin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateBassin = (req, res) => {
    try {
        const index = mockBassins.findIndex(b => b.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Bassin non trouvé' });
        mockBassins[index] = { ...mockBassins[index], ...req.body };
        res.json(mockBassins[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteBassin = (req, res) => {
    try {
        const index = mockBassins.findIndex(b => b.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Bassin non trouvé' });
        mockBassins.splice(index, 1);
        res.json({ message: 'Bassin supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};