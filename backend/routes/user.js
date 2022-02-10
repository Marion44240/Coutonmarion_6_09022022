// Importation express
const express = require('express');
const router = express.Router();

// Importation du fichier controllers User
const userCtrl = require('../controllers/user');

// route POST pour enregistrer un nouvel utilisateur
router.post('/signup', userCtrl.signup);
// route POST pour la connection d'un utilisateur
router.post('/login', userCtrl.login);

module.exports = router;