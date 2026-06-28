const db = require('../config/database');

// ✅ DONNÉES MOCKÉES
const mockStocks = [
    { id: 1, type_nourriture: 'Aliment Tilapia', quantite: 150, unite: 'kg', statut: 'Bon', seuil_alerte: 50, jours_restants: 10 },
    { id: 2, type_nourriture: 'Aliment Sea Bass', quantite: 200, unite: 'kg', statut: 'Bon', seuil_alerte: 60, jours_restants: 12 },
    { id: 3, type_nourriture: 'Aliment Truite', quantite: 80, unite: 'kg', statut: 'Attention', seuil_alerte: 30, jours_restants: 5 }
];

const mockSessions = [
    { id: 1, heure: '08:00', periode: 'MATIN', bassin_nom: 'Bassin A', espece: 'Tilapia', quantite: 25, type_nourriture: 'Aliment Tilapia', statut: 'PROGRAMMÉ' },
    { id: 2, heure: '08:30', periode: 'MATIN', bassin_nom: 'Bassin B', espece: 'Sea Bass', quantite: 30, type_nourriture: 'Aliment Sea Bass', statut: 'PROGRAMMÉ' }
];

exports.getStocks = async (req, res) => {
    try {
        // const result = await db.query('SELECT * FROM stocks ORDER BY id');
        // res.json(result.rows);
        res.json(mockStocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getSessions = async (req, res) => {
    try {
        // const result = await db.query('SELECT * FROM sessions_nourriture ORDER BY id');
        // res.json(result.rows);
        res.json(mockSessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Gardez les autres fonctions avec des données mockées
exports.addStock = async (req, res) => {
    try {
        const newStock = { id: mockStocks.length + 1, ...req.body };
        mockStocks.push(newStock);
        res.status(201).json(newStock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateStock = async (req, res) => {
    try {
        const index = mockStocks.findIndex(s => s.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Stock non trouvé' });
        mockStocks[index] = { ...mockStocks[index], ...req.body };
        res.json(mockStocks[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deleteStock = async (req, res) => {
    try {
        const index = mockStocks.findIndex(s => s.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Stock non trouvé' });
        mockStocks.splice(index, 1);
        res.json({ message: 'Stock supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addSession = async (req, res) => {
    try {
        const newSession = { id: mockSessions.length + 1, ...req.body };
        mockSessions.push(newSession);
        res.status(201).json(newSession);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const index = mockSessions.findIndex(s => s.id === parseInt(req.params.id));
        if (index === -1) return res.status(404).json({ error: 'Session non trouvée' });
        mockSessions[index] = { ...mockSessions[index], ...req.body };
        res.json(mockSessions[index]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};