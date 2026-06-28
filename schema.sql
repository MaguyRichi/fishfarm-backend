-- ==========================================
-- FICHIER SCHEMA.SQL
-- Crée toutes les tables de la base de données
-- ==========================================

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des bassins
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

-- Table des données de croissance
CREATE TABLE IF NOT EXISTS croissance (
    id SERIAL PRIMARY KEY,
    semaine INTEGER NOT NULL,
    poids_reel DECIMAL(10,2),
    poids_industriel DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des échantillonnages
CREATE TABLE IF NOT EXISTS echantillonnages (
    id SERIAL PRIMARY KEY,
    bassin_id INTEGER REFERENCES bassins(id) ON DELETE CASCADE,
    date_echantillon DATE NOT NULL,
    poids_moyen DECIMAL(10,2),
    ecart_type DECIMAL(10,2),
    mortalite DECIMAL(5,2),
    statut VARCHAR(50) DEFAULT 'Optimal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des stocks de nourriture
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    type_nourriture VARCHAR(100) NOT NULL,
    quantite DECIMAL(10,2),
    unite VARCHAR(20),
    statut VARCHAR(50) DEFAULT 'Bon',
    seuil_alerte DECIMAL(10,2),
    jours_restants INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des sessions de nourriture
CREATE TABLE IF NOT EXISTS sessions_nourriture (
    id SERIAL PRIMARY KEY,
    heure VARCHAR(10),
    periode VARCHAR(20),
    bassin_nom VARCHAR(100),
    espece VARCHAR(100),
    quantite DECIMAL(10,2),
    type_nourriture VARCHAR(100),
    statut VARCHAR(50) DEFAULT 'PROGRAMMÉ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de la qualité de l'eau
CREATE TABLE IF NOT EXISTS qualite_eau (
    id SERIAL PRIMARY KEY,
    bassin_id INTEGER REFERENCES bassins(id) ON DELETE CASCADE,
    date_mesure DATE NOT NULL,
    temperature DECIMAL(5,2),
    oxygene DECIMAL(5,2),
    ph DECIMAL(5,2),
    ammoniac DECIMAL(10,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des alertes
CREATE TABLE IF NOT EXISTS alertes (
    id SERIAL PRIMARY KEY,
    type_alerte VARCHAR(50),
    niveau VARCHAR(50),
    bassin_nom VARCHAR(100),
    valeur DECIMAL(10,2),
    seuil DECIMAL(10,2),
    description TEXT,
    date_alerte DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- DONNÉES DE TEST (optionnel)
-- ==========================================

-- Insérer un utilisateur admin (mot de passe: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Administrateur', 'admin@fishfarm.com', '$2b$10$YQxVzXxVzXxVzXxVzXxVzXe', 'admin') 
ON CONFLICT (email) DO NOTHING;

-- Insérer des bassins de test
INSERT INTO bassins (nom, espece, densite, population, statut, oxygene, temperature, dernier_repas, alerte) VALUES
('Bassin A', 'Tilapia', 2.5, 150, 'Optimal', 8.5, 22.0, '08:00', false),
('Bassin B', 'Sea Bass', 3.0, 200, 'Optimal', 7.8, 21.0, '09:30', false),
('Bassin C', 'Truite Arc-en-ciel', 4.0, 120, 'Attention', 4.5, 23.0, '10:00', true),
('Bassin D', 'Carpe', 2.8, 180, 'Optimal', 7.2, 22.5, '11:00', false);

-- Insérer des données de croissance
INSERT INTO croissance (semaine, poids_reel, poids_industriel) VALUES
(1, 100, 95),
(2, 110, 108),
(3, 120, 115),
(4, 130, 125),
(5, 145, 138);

-- Insérer des échantillons
INSERT INTO echantillonnages (bassin_id, date_echantillon, poids_moyen, ecart_type, mortalite, statut) VALUES
(1, '2026-06-20', 120, 5.2, 0.02, 'Optimal'),
(1, '2026-06-21', 125, 4.8, 0.01, 'Optimal'),
(2, '2026-06-22', 130, 6.1, 0.15, 'Alerte');

-- Insérer des stocks
INSERT INTO stocks (type_nourriture, quantite, unite, statut, seuil_alerte, jours_restants) VALUES
('Aliment Tilapia', 150, 'kg', 'Bon', 50, 10),
('Aliment Sea Bass', 200, 'kg', 'Bon', 60, 12),
('Aliment Truite', 80, 'kg', 'Attention', 30, 5);

-- Insérer des sessions de nourriture
INSERT INTO sessions_nourriture (heure, periode, bassin_nom, espece, quantite, type_nourriture, statut) VALUES
('08:00', 'MATIN', 'Bassin A', 'Tilapia', 25, 'Aliment Tilapia', 'PROGRAMMÉ'),
('08:30', 'MATIN', 'Bassin B', 'Sea Bass', 30, 'Aliment Sea Bass', 'PROGRAMMÉ'),
('12:00', 'MIDI', 'Bassin C', 'Truite Arc-en-ciel', 20, 'Aliment Truite', 'PROGRAMMÉ');

-- Insérer des mesures de qualité d'eau
INSERT INTO qualite_eau (bassin_id, date_mesure, temperature, oxygene, ph, ammoniac) VALUES
(1, '2026-06-20', 22.0, 8.5, 7.2, 0.02),
(1, '2026-06-21', 22.5, 8.3, 7.1, 0.025),
(2, '2026-06-20', 21.0, 7.8, 7.0, 0.03),
(3, '2026-06-20', 23.0, 4.5, 7.3, 0.04);