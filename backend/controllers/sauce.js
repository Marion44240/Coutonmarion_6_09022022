// Importation models des sauces
const Sauce = require('../models/sauce');
// File system permet de modifier le système de fichiers
const fs = require('fs');

// Création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    // Créer une nouvelle instance de notre modéle sauce
    const sauce = new Sauce({
        // L'opérateur spread ... copie tous les éléments du corps de la requête
        ...sauceObject,
        // url compléte de l'image (protocol= HTTP, host=url, filename= nom du fichier)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    // Enregistrement de la sauce dans la base de donnée
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch((error) => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    // Création d'un objet sauce qui regarde si req.file existe ou pas
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        // si oui on traite la nouvelle image sinon on traite l'objet entrant
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filname}`
    } : { ...req.body };
    // Mise a jour des modifications
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
        .catch((error) => res.status(400).json({ error }));
};

// Suppresion d'une sauce
exports.deleteSauce = (req, res, next) => {
    // Utilisation de l'ID qu'on a reçu en paramètre pour accéder a la sauce correspondant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Nom du fichier image
            const filename = sauce.imageUrl.split('/images/')[1];
            // Supression du fichier image
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
                .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

// Récupére info d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    // Trouve la sauce ayant le même _id que le paramètre de la requête
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// Récupére info de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    // Renvoie un tableau de toute les sauces dans la base de donnée
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

// Gestion likes/dislikes des sauces
exports.likeSauce  = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    // Trouve la sauce ayant le même _id que le paramètre de la requête
    Sauce.findOne({ _id: req.params.id })
        .then ((sauce) => {
            // ID de l'utilisateur qui vote
            let userLike = sauce.usersLiked.find((id) => id === userId);
            let userDislike = sauce.usersDisliked.find((id) => id === userId);

            switch (like) {
                // Ajoute un like
                case 1:
                    sauce.likes += 1;
                    sauce.usersLiked.push(userId);
                    break;

                // Supprime un like/dislike
                case 0: 
                    if (userLike) {
                        sauce.likes -= 1;
                        sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
                    } else if (userDislike) {
                        sauce.dislikes -= 1;
                        sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
                    }
                    break;

                // Ajoute un dislike
                case -1: 
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(userId);
                    break;
            }

            // Sauvegarde dans la base de données
            sauce.save()
                .then(() => res.status(201).json({ message: 'sauvegarde de la sauce' }))
                .catch ((error) => res.status(400).json({ error }));
        })
    .catch((error) => res.status(500).json({ error }));
}