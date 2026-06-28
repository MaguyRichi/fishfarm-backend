const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const bassinRoutes = require('./routes/bassins');
const croissanceRoutes = require('./routes/croissance');
const nourritureRoutes = require('./routes/nourriture');
const dashboardRoutes = require('./routes/dashboard');
const qualiteEauRoutes = require('./routes/qualiteEau');
//const croissanceEspeceRoutes = require('./routes/croissanceEspece');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bassins', bassinRoutes);
app.use('/api/croissance', croissanceRoutes);
app.use('/api/nourriture', nourritureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/qualite-eau', qualiteEauRoutes);
app.use('/api/croissance-espece', croissanceEspeceRoutes);

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API FishFarm fonctionne' });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('❌ Erreur:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur le port ${PORT}`);
});