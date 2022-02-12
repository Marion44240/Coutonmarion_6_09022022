// Importation Express
const express = require('express');
// Création des routeurs pour la séparation de chaque route liée a une action sur les sauces
const router = express.Router();

// Importation controllers des sauces
const sauceCtrl = require('../controllers/sauce');
// Importation middleware pour la gestion d'authentification utilisateur
const auth = require('../middleware/auth');
// Importation middleware pour la gestion des images
const multer = require('../middleware/multer-config');


router.post('/', auth, multer, sauceCtrl.createSauce); // Création
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Modification
router.delete('/:id', auth, sauceCtrl.deleteSauce); // Suppresssion
router.get('/:id', auth, sauceCtrl.getOneSauce); // Affichage d'une sauce
router.get('/', auth, sauceCtrl.getAllSauce); // Affichage de toute les sauces

module.exports = router;