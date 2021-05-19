// On importe le "model" type pour les données relatives aux sauces
const sauceSchema = require("../models/sauces-M")
// On importe le package "fs" pour la gestion des fichiers
const fs = require("fs")

// On exporte la fonction qui permet de récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    
    // Ici, on récupère toutes les sauces et on les envoies dans la réponse de la requête
    sauceSchema.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch(() => {res.status(404).json({message: "Les sauces n'ont pas pu être récupérer"})})

}

// On exporte la fonction qui permet de récupérer une sauce cible
exports.getOneSauce = (req, res, next) => {

    // Ici, on récupère une sauce cible et on l'envoie dans la réponse de la requête
    sauceSchema.findOne({ _id: req.params.id })
    .then((sauce) => {res.status(200).json(sauce)})
    .catch(() => {res.status(404).json({message: "La sauce n'a pas pu être récupérer"})})

}

// On exporte la fonction qui permet de créer une sauce
exports.createSauce = (req, res, next) => {

    // Ici, on récupére les données du formulaire (multipart/form-data)
    const sauceObject = JSON.parse(req.body.sauce)
    // Ici, on supprime l'ObjectId générer par le front-end
    delete sauceObject._id
    // Ici, on créer une nouvelle sauce avec les éléments de la requête en ajoutant l'URL de l'image
    const sauce = new sauceSchema({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    // Ici, on sauvegarde la sauce dans la base de donnée
    sauce.save()
    .then(() => {res.status(201).json({message: "La sauce est enrengistrée !"})})
    .catch(() => {res.status(400).json({message: "La sauce n'a pas pu être enrengistrée"})})

}

// On exporte la fonction qui permet de modifier une sauce
exports.modifySauce = (req, res, next) => {
    
    // Ici, on récupère une sauce qui a pour ObjectId, l'ID en paramètre de l'URL
    sauceSchema.findOne({_id: req.params.id})
    .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]
        const sauceName = sauce.name
        updateSauce(filename, sauceName)
    })
    .catch((error) => {console.log(error)})

    function updateSauce(oldImage, sauceName) {

        // SI la requête contient une nouvelle image ...
        if(req.file){

            // On créer un objet "sauce" en ajoutant l'URL de la nouvelle image et en remettant les compteurs de like/dislike à zéro
            var sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                likes: 0,
                dislikes: 0,
                usersLiked: [],
                usersDisliked: []
            }
            
        // SINON ...
        } else {

            // On créer un objet "sauce" en remettant seulement les compteurs de like/dislike à zéro
            var sauceObject = {
                ...req.body,
                likes: 0,
                dislikes: 0,
                usersLiked: [],
                usersDisliked: []
            }
        }

        // Ici, on remplace la sauce de la base de donnée par celle qu'on a mis à jour
        sauceSchema.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => {
            res.status(201).json({message: "La sauce a été modifiée !"})

            // SI la requête contient une nouvelle image ...
            if (req.file) {

                // On supprime l'ancienne
                fs.unlink(`images/${oldImage}`, (err) => {
                    if (err) throw err
                    console.log(`L'ancienne image (${oldImage}) de la sauce (${sauceName}) a été supprimée`)
                })
            }
        })
        .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être modifiée"})})
    }

}

// On exporte la fonction qui permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {

    // Ici, on récupère une sauce qui a pour ObjectId, l'ID ne paramètre de l'URL
    sauceSchema.findOne({_id: req.params.id})
    .then((sauce) => {
        // Ici, on capture le nom de l'image
        const filename = sauce.imageUrl.split('/images/')[1]
        // Ici, on supprime l'image du serveur
        fs.unlink(`images/${filename}`, () => {
            // Ici, on supprime la sauce de la base de donnée
            sauceSchema.deleteOne({_id: req.params.id})
            .then(() => {res.status(200).json({message: "La sauce a été supprimée !"})})
            .catch(() => {res.status(400).json({message: "La sauce n'a pas pu être supprimée"})})
        })
    })
    .catch(() => {res.status(400).json({message: "La sauce n'a pas pu être supprimée"})})
    
}

// On exporte la fonction qui permet de liker ou disliker une sauce
exports.likeSauce = (req, res, next) => {

    // SI la "clé" like de la requête est -->
    switch (req.body.like){

        // EGALE à 1
        case 1 : 

            // On incrémente de 1 le nombre de "like" de la sauce et on ajoute le userId dans son tableau "usersLiked"
            sauceSchema.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
            .then(() => {res.status(201).json({message: "La sauce a été liké !"})})
            .catch(() => {res.status(400).json({message: "La sauce n'a pas pu être liké"})})

        break

        // EGALE à -1
        case -1 : 

            // On incrémente de 1 le nombre de "dislikes" de la sauce et on ajoute le userId dans son tableau "usersDisliked"
            sauceSchema.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
            .then(() => {res.status(201).json({message: "La sauce a été disliké !"})})
            .catch(() => {res.status(400).json({message: "La sauce n'a pas pu être disliké"})})  

        break

        // EGALE à 0
        case 0 :

            // On récupère une sauce qui a pour ObjectId, l'ID ne paramètre de l'URL
            sauceSchema.findOne({_id: req.params.id})
            .then((sauceFind) => {

                // SI on trouve dans le tableau "usersLiked", le "userId" de la requête ...
                if (sauceFind.usersLiked.find(user => user == req.body.userId)) {

                    // On incrémente de -1 le nombre de "likes" de la sauce et on retire le userId de son tableau "usersLiked"
                    sauceSchema.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                    .then(() => {res.status(201).json({message: "Vous n'avez plus d'opinion pour cette sauce !"})})
                    .catch(() => {res.status(400).json({message: "Vous n'avez pas pu modifier votre opinion pour cette sauce"})})
                
                // SINON, si on trouve dans le tableau "usersLiked", le "userId" de la requête ...
                } else if (sauceFind.usersDisliked.find(user => user == req.body.userId)) {

                    // On incrémente de -1 le nombre de "dislikes" de la sauce et on retire le userId de son tableau "usersDisliked"
                    sauceSchema.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                    .then(() => {res.status(201).json({message: "Vous n'avez plus d'opinion pour cette sauce !"})})
                    .catch(() => {res.status(400).json({message: "Vous n'avez pas pu modifier votre opinion pour cette sauce"})})
                } 
            })
            .catch(() => {res.status(400).json({message: "Vous n'avez pas pu modifier votre opinion pour cette sauce"})})

        break

        default: 
            res.status(400).json({message: "Vous ne pouvez pas proférer d'autre opinion pour cette sauce"})
    }
    
}
  