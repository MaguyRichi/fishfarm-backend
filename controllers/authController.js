const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
            [name, email, hashedPassword, role || 'user']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur register:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const result = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Erreur getProfile:', error);
        res.status(401).json({ error: 'Token invalide' });
    }
};