//const db = require('../config/database');

const mockMesures = [
    { id: 1, bassin_id: 1, date_mesure: '2026-06-20', temperature: 22.0, oxygene: 8.5, ph: 7.2, ammoniac: 0.02 },
    { id: 2, bassin_id: 1, date_mesure: '2026-06-21', temperature: 22.5, oxygene: 8.3, ph: 7.1, ammoniac: 0.025 },
    { id: 3, bassin_id: 2, date_mesure: '2026-06-20', temperature: 21.0, oxygene: 7.8, ph: 7.0, ammoniac: 0.03 },
    { id: 4, bassin_id: 3, date_mesure: '2026-06-20', temperature: 23.0, oxygene: 4.5, ph: 7.3, ammoniac: 0.04 }
];

exports.getAllMesures = (req, res) => {
    try {
        res.json(mockMesures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.addMesure = (req, res) => {
    try {
        const newMesure = { id: mockMesures.length + 1, ...req.body };
        mockMesures.push(newMesure);
        res.status(201).json(newMesure);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getMesuresByBassin = (req, res) => {
    try {
        const mesures = mockMesures.filter(m => m.bassin_id === parseInt(req.params.bassinId));
        res.json(mesures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};