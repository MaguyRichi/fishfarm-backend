const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
    try {
        console.log('🔧 Connexion à la base de données...');
        
        // 1. Créer les tables si elles n'existent pas
        console.log('📋 Création des tables...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS bassins (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                espece VARCHAR(100),
                densite DECIMAL(5,2),
                population INTEGER,
                statut VARCHAR(50) DEFAULT 'Optimal',
                oxygene DECIMAL(5,2),
                temperature DECIMAL(5,2),
                dernier_repas VARCHAR(10),
                alerte BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS croissance (
                id SERIAL PRIMARY KEY,
                semaine INTEGER NOT NULL,
                poids_reel DECIMAL(10,2),
                poids_industriel DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS echantillonnages (
                id SERIAL PRIMARY KEY,
                date_echantillon DATE NOT NULL,
                poids_moyen DECIMAL(10,2),
                ecart_type DECIMAL(10,2),
                mortalite DECIMAL(5,2),
                statut VARCHAR(50) DEFAULT 'Optimal',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS stocks (
                id SERIAL PRIMARY KEY,
                nom VARCHAR(100) NOT NULL,
                quantite DECIMAL(10,2),
                unite VARCHAR(20),
                seuil_alerte DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions_nourriture (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                heure VARCHAR(10),
                bassin VARCHAR(100),
                quantite DECIMAL(10,2),
                unite VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS qualite_eau (
                id SERIAL PRIMARY KEY,
                bassin_id INTEGER REFERENCES bassins(id),
                date DATE NOT NULL,
                temperature DECIMAL(5,2),
                oxygene DECIMAL(5,2),
                ph DECIMAL(5,2),
                ammoniac DECIMAL(10,3),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Vérifier si les données existent déjà
        const checkBassins = await pool.query('SELECT COUNT(*) FROM bassins');
        if (parseInt(checkBassins.rows[0].count) > 0) {
            console.log('⚠️ Les données existent déjà. Suppression des anciennes données...');
            await pool.query(`
                TRUNCATE TABLE qualite_eau, sessions_nourriture, stocks, echantillonnages, croissance, bassins RESTART IDENTITY CASCADE;
            `);
        }

        // 3. Insérer les données de test
        console.log('📝 Insertion des données de test...');

        // Bassins
        await pool.query(`
            INSERT INTO bassins (nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte) VALUES
            ('Bassin A', 'Tilapia', 2.5, 150, 'Optimal', 8.5, 22.0, '08:00', false),
            ('Bassin B', 'Sea Bass', 3.0, 200, 'Optimal', 7.8, 21.0, '09:30', false),
            ('Bassin C', 'Truite Arc-en-ciel', 4.0, 120, 'Attention', 4.5, 23.0, '10:00', true),
            ('Bassin D', 'Carpe', 2.8, 180, 'Optimal', 7.2, 22.5, '11:00', false)
        `);

        // Croissance
        await pool.query(`
            INSERT INTO croissance (semaine, poids_reel, poids_industriel) VALUES
            (1, 100, 95),
            (2, 110, 108),
            (3, 120, 115),
            (4, 130, 125),
            (5, 145, 138)
        `);

        // Échantillonnages
        await pool.query(`
            INSERT INTO echantillonnages (date_echantillon, poids_moyen, ecart_type, mortalite, statut) VALUES
            ('2026-06-20', 120, 5.2, 0.02, 'Optimal'),
            ('2026-06-21', 125, 4.8, 0.01, 'Optimal'),
            ('2026-06-22', 130, 6.1, 0.15, 'Alerte')
        `);

        // Stocks
        await pool.query(`
            INSERT INTO stocks (nom, quantite, unite, seuil_alerte) VALUES
            ('Aliment Tilapia', 150, 'kg', 50),
            ('Aliment Sea Bass', 200, 'kg', 60),
            ('Aliment Truite', 80, 'kg', 30)
        `);

        // Sessions nourriture
        await pool.query(`
            INSERT INTO sessions_nourriture (date, heure, bassin, quantite, unite) VALUES
            ('2026-06-20', '08:00', 'Bassin A', 25, 'kg'),
            ('2026-06-21', '08:30', 'Bassin B', 30, 'kg')
        `);

        // Qualité d'eau (avec les bons IDs de bassins)
        await pool.query(`
            INSERT INTO qualite_eau (bassin_id, date, temperature, oxygene, ph, ammoniac) VALUES
            (1, '2026-06-20', 22.0, 8.5, 7.2, 0.02),
            (1, '2026-06-21', 22.5, 8.3, 7.1, 0.025),
            (2, '2026-06-20', 21.0, 7.8, 7.0, 0.03),
            (3, '2026-06-20', 23.0, 4.5, 7.3, 0.04)
        `);

        console.log('✅ Données de test insérées avec succès !');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        process.exit(1);
    }
}

seedDatabase();