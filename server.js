const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ============ DONNÉES MOCKÉES ============
const mockBassins = [
    { id: 1, nom: 'Bassin A', espece: 'Tilapia', densite: 2.5, population: 150, statut: 'Optimal', oxygene: 8.5, temperature: 22.0, dernier_repas: '08:00', alerte: false },
    { id: 2, nom: 'Bassin B', espece: 'Sea Bass', densite: 3.0, population: 200, statut: 'Optimal', oxygene: 7.8, temperature: 21.0, dernier_repas: '09:30', alerte: false },
    { id: 3, nom: 'Bassin C', espece: 'Truite Arc-en-ciel', densite: 4.0, population: 120, statut: 'Attention', oxygene: 4.5, temperature: 23.0, dernier_repas: '10:00', alerte: true },
    { id: 4, nom: 'Bassin D', espece: 'Carpe', densite: 2.8, population: 180, statut: 'Optimal', oxygene: 7.2, temperature: 22.5, dernier_repas: '11:00', alerte: false }
];

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

const mockStocks = [
    { id: 1, type_nourriture: 'Aliment Tilapia', quantite: 150, unite: 'kg', statut: 'Bon', seuil_alerte: 50, jours_restants: 10 },
    { id: 2, type_nourriture: 'Aliment Sea Bass', quantite: 200, unite: 'kg', statut: 'Bon', seuil_alerte: 60, jours_restants: 12 },
    { id: 3, type_nourriture: 'Aliment Truite', quantite: 80, unite: 'kg', statut: 'Attention', seuil_alerte: 30, jours_restants: 5 }
];

const mockSessions = [
    { id: 1, heure: '08:00', periode: 'MATIN', bassin_nom: 'Bassin A', espece: 'Tilapia', quantite: 25, type_nourriture: 'Aliment Tilapia', statut: 'PROGRAMMÉ' },
    { id: 2, heure: '08:30', periode: 'MATIN', bassin_nom: 'Bassin B', espece: 'Sea Bass', quantite: 30, type_nourriture: 'Aliment Sea Bass', statut: 'PROGRAMMÉ' },
    { id: 3, heure: '12:00', periode: 'MIDI', bassin_nom: 'Bassin C', espece: 'Truite Arc-en-ciel', quantite: 20, type_nourriture: 'Aliment Truite', statut: 'PROGRAMMÉ' }
];

const mockMesures = [
    { id: 1, bassin_id: 1, date_mesure: '2026-06-20', temperature: 22.0, oxygene: 8.5, ph: 7.2, ammoniac: 0.02 },
    { id: 2, bassin_id: 1, date_mesure: '2026-06-21', temperature: 22.5, oxygene: 8.3, ph: 7.1, ammoniac: 0.025 },
    { id: 3, bassin_id: 2, date_mesure: '2026-06-20', temperature: 21.0, oxygene: 7.8, ph: 7.0, ammoniac: 0.03 }
];

const mockStats = {
    bassinsTotal: 4,
    poissonsTotal: 650,
    tauxOccupation: 85,
    productionJournaliere: 45.2
};

const mockWaterQuality = {
    temperature: 22.0,
    oxygene: 8.5,
    ph: 7.2,
    ammoniac: 0.02
};

const mockAlerts = [
    { type_alerte: 'Température', niveau: 'Alerte', bassin_nom: 'Bassin C', valeur: 23, seuil: 22, description: 'Température élevée', date_alerte: '2026-06-22' },
    { type_alerte: 'Oxygène', niveau: 'Alerte', bassin_nom: 'Bassin C', valeur: 4.5, seuil: 5.0, description: "Niveau d'oxygène bas", date_alerte: '2026-06-22' }
];

const mockEspeces = [
    { espece: 'Tilapia', population: 150, nombre_bassins: 1 },
    { espece: 'Sea Bass', population: 200, nombre_bassins: 1 },
    { espece: 'Truite Arc-en-ciel', population: 120, nombre_bassins: 1 },
    { espece: 'Carpe', population: 180, nombre_bassins: 1 }
];

// ============ ROUTES ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API FishFarm fonctionne' });
});

app.get('/api/bassins', (req, res) => {
    res.json(mockBassins);
});

app.get('/api/bassins/:id', (req, res) => {
    const bassin = mockBassins.find(b => b.id === parseInt(req.params.id));
    if (!bassin) return res.status(404).json({ error: 'Bassin non trouvé' });
    res.json(bassin);
});

app.post('/api/bassins', (req, res) => {
    const newBassin = { id: mockBassins.length + 1, ...req.body };
    mockBassins.push(newBassin);
    res.status(201).json(newBassin);
});

app.put('/api/bassins/:id', (req, res) => {
    const index = mockBassins.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Bassin non trouvé' });
    mockBassins[index] = { ...mockBassins[index], ...req.body };
    res.json(mockBassins[index]);
});

app.delete('/api/bassins/:id', (req, res) => {
    const index = mockBassins.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Bassin non trouvé' });
    mockBassins.splice(index, 1);
    res.json({ message: 'Bassin supprimé' });
});

app.get('/api/croissance', (req, res) => {
    res.json(mockCroissance);
});

app.get('/api/croissance/echantillons', (req, res) => {
    res.json(mockEchantillons);
});

app.post('/api/croissance/echantillons', (req, res) => {
    const newEchantillon = { id: mockEchantillons.length + 1, ...req.body };
    mockEchantillons.push(newEchantillon);
    res.status(201).json(newEchantillon);
});

app.get('/api/croissance-espece', (req, res) => {
    res.json(mockEspeces);
});

app.get('/api/croissance/rapport', (req, res) => {
    res.json({
        date: new Date().toISOString(),
        statistiques: {
            total_bassins: 4,
            total_poissons: 650,
            densite_moyenne: 45.2,
            bassins_alerte: 1
        },
        croissanceEspece: mockEspeces,
        qualiteEau: {
            temp_moyenne: 21.5,
            oxygene_moyen: 7.8,
            ph_moyen: 7.2,
            ammoniac_moyen: 0.025
        },
        echantillonnages: mockEchantillons
    });
});

app.post('/api/croissance/export', (req, res) => {
    res.json({ message: 'Exportation réussie', format: 'PDF' });
});

app.get('/api/nourriture/stocks', (req, res) => {
    res.json(mockStocks);
});

app.post('/api/nourriture/stocks', (req, res) => {
    const newStock = { id: mockStocks.length + 1, ...req.body };
    mockStocks.push(newStock);
    res.status(201).json(newStock);
});

app.put('/api/nourriture/stocks/:id', (req, res) => {
    const index = mockStocks.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Stock non trouvé' });
    mockStocks[index] = { ...mockStocks[index], ...req.body };
    res.json(mockStocks[index]);
});

app.delete('/api/nourriture/stocks/:id', (req, res) => {
    const index = mockStocks.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Stock non trouvé' });
    mockStocks.splice(index, 1);
    res.json({ message: 'Stock supprimé' });
});

app.get('/api/nourriture/sessions', (req, res) => {
    res.json(mockSessions);
});

app.post('/api/nourriture/sessions', (req, res) => {
    const newSession = { id: mockSessions.length + 1, ...req.body };
    mockSessions.push(newSession);
    res.status(201).json(newSession);
});

app.put('/api/nourriture/sessions/:id', (req, res) => {
    const index = mockSessions.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Session non trouvée' });
    mockSessions[index] = { ...mockSessions[index], ...req.body };
    res.json(mockSessions[index]);
});

app.get('/api/dashboard/stats', (req, res) => {
    res.json(mockStats);
});

app.get('/api/dashboard/water-quality', (req, res) => {
    res.json(mockWaterQuality);
});

app.get('/api/dashboard/alerts', (req, res) => {
    res.json(mockAlerts);
});

app.get('/api/dashboard/kpis', (req, res) => {
    res.json({
        poidsMoyen: 145.5,
        croissanceJour: 2.3,
        tauxMortalite: 0.05,
        densiteMoyenne: 42.5
    });
});

app.get('/api/qualite-eau', (req, res) => {
    res.json(mockMesures);
});

app.post('/api/qualite-eau', (req, res) => {
    const newMesure = { id: mockMesures.length + 1, ...req.body };
    mockMesures.push(newMesure);
    res.status(201).json(newMesure);
});

app.get('/api/qualite-eau/bassin/:bassinId', (req, res) => {
    const mesures = mockMesures.filter(m => m.bassin_id === parseInt(req.params.bassinId));
    res.json(mesures);
});

// Route pour l'authentification (simplifiée)
app.post('/api/auth/login', (req, res) => {
    res.json({ 
        token: 'mock-token-12345', 
        user: { id: 1, name: 'Administrateur', email: 'admin@fishfarm.com', role: 'admin' } 
    });
});

// ============ GESTION DES ERREURS ============
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
    console.error('❌ Erreur:', err.message);
    res.status(500).json({ error: 'Erreur serveur', details: err.message });
});

// ============ PORT ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});