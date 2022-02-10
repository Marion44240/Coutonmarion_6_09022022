// Importation mongoose
const mongoose = require('mongoose');

// Module qui controle l'email pour s'assurer que deux utilisateurs ne puissent pas utiliser la même adresse e-mail
const uniqueValidator = require('mongoose-unique-validator');

// Création d'un modèle de données pour les informations d'authentification utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// plug-in, s'assure que deux utilisateurs ne partage pas la même adresse e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);