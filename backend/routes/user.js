// Importation express
const express = require('express');
const router = express.Router();

// Importation du fichier controllers User
const userCtrl = require('../controllers/user');
// Importation password-validator
const password = require('../middleware/password');

// route POST pour enregistrer un nouvel utilisateur
router.post('/signup', password, userCtrl.signup);
// route POST pour la connection d'un utilisateur
router.post('/login', userCtrl.login);

module.exports = router;