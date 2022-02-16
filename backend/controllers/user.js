// Importation bcrypt pour le hash du mot de passe
const bcrypt = require('bcrypt');

// Importation jsonwebtoken pour le token d'authentification
const jwt = require('jsonwebtoken');

// Importation du fichier models user
const User = require('../models/user');

// Inscription utilisateur
exports.signup = (req, res, next) => {
    // Cryptage du mot de passe
    bcrypt.hash(req.body.password, 10)
    // Information utilisateur
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // Sauvegarde dans la base de donnée
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Connexion utilisateur
exports.login = (req, res, next) => {
    // Recherche utilisateur dans la base de donnée
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Vérification mot de passe utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Création du token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
            })
            .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};