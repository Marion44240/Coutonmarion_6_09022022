// Importation Express
const express = require('express');
const app = express();

// Importation Mongoose
const mongoose = require('mongoose');

// Importation module node pour le chemin image
const path = require('path');

// Importation module helmet pour sécurisé les en-têtes HTTP
const helmet = require('helmet');
app.use(helmet());

// Importation dotenv (variable d'environement)
require('dotenv').config();

// Importation routes
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// Connection a la base de donné mongoDB
mongoose.connect(`mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASSWORD}@${process.env.SECRET_CLUSTER}/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS, système de sécurité qui bloque les appels HTTP entre des serveurs différents ce qui empêche les requêtes malveillantes d'accéder à des resources sensibles
app.use((req, res, next) => {

    // Accés à notre API depuis n'importe quelle origine 
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Ajoute les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');

    // Envoye des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// CORS, pour autoriser les images
app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Resource-Policy');
    next();
});

// Analyse le corps de la requête
app.use(express.json());

// Gére les ressources images de façon statique d'une requête vers le dossier Images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Création et identification utilisateur
app.use('/api/auth', userRoutes);

// Création, modification, suppression des sauces 
app.use('/api/sauces', sauceRoutes);

module.exports = app;