const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ============ DONNÉES MOCKÉES ============
const mockBassins = [
    { id: 1, nom: 'Bassin A', espece: 'Tilapia', population: 150, statut: 'Optimal' },
    { id: 2, nom: 'Bassin B', espece: 'Sea Bass', population: 200, statut: 'Optimal' },
    { id: 3, nom: 'Bassin C', espece: 'Truite Arc-en-ciel', population: 120, statut: 'Attention' },
    { id: 4, nom: 'Bassin D', espece: 'Carpe', population: 180, statut: 'Optimal' }
];

const mockCroissance = [
    { semaine: 1, poids_reel: 100, poids_industriel: 95 },
    { semaine: 2, poids_reel: 110, poids_industriel: 108 },
    { semaine: 3, poids_reel: 120, poids_industriel: 115 }
];

// ============ ROUTES ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API FishFarm fonctionne' });
});

app.get('/api/bassins', (req, res) => {
    res.json(mockBassins);
});

app.get('/api/croissance', (req, res) => {
    res.json(mockCroissance);
});

app.get('/api/croissance/echantillons', (req, res) => {
    res.json([
        { id: 1, date_echantillon: '2026-06-20', poids_moyen: 120, statut: 'Optimal' }
    ]);
});

app.get('/api/nourriture/stocks', (req, res) => {
    res.json([
        { id: 1, type_nourriture: 'Aliment Tilapia', quantite: 150, unite: 'kg' }
    ]);
});

app.get('/api/nourriture/sessions', (req, res) => {
    res.json([
        { id: 1, heure: '08:00', bassin_nom: 'Bassin A', quantite: 25 }
    ]);
});

app.get('/api/dashboard/stats', (req, res) => {
    res.json({ bassinsTotal: 4, poissonsTotal: 650 });
});

app.get('/api/dashboard/water-quality', (req, res) => {
    res.json({ temperature: 22.0, oxygene: 8.5, ph: 7.2 });
});

app.get('/api/dashboard/alerts', (req, res) => {
    res.json([
        { type_alerte: 'Température', niveau: 'Alerte', bassin_nom: 'Bassin C' }
    ]);
});

app.get('/api/qualite-eau', (req, res) => {
    res.json([
        { id: 1, bassin_id: 1, temperature: 22.0, oxygene: 8.5 }
    ]);
});

app.get('/api/croissance-espece', (req, res) => {
    res.json([
        { espece: 'Tilapia', population: 150, nombre_bassins: 1 },
        { espece: 'Sea Bass', population: 200, nombre_bassins: 1 }
    ]);
});

// ============ PORT ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});