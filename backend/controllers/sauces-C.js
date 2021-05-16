const sauceSchema = require("../models/sauces-M")
const fs = require("fs")

exports.getAllSauce = (req, res, next) => {

    sauceSchema.find()
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {res.status(404).json({erreur: error})})

}

exports.getOneSauce = (req, res, next) => {

    sauceSchema.findOne({ _id: req.params.id })
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(404).json({erreur: error})})

}

exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new sauceSchema({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
    .then(() => {res.status(201).json({message: "La sauce est enrengistrée !"})})
    .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être enrengistrée", erreur : error})})

}

exports.modifySauce = (req, res, next) => {
    
    sauceSchema.findOne({_id: req.params.id})
    .then(() => {
        if(req.file){
            var sauceObject = {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                likes: 0,
                dislikes: 0,
                usersLiked: [],
                usersDisliked: []
            }
        } else {
            var sauceObject = {
                ...req.body,
                likes: 0,
                dislikes: 0,
                usersLiked: [],
                usersDisliked: []
            } 
        }
        sauceSchema.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => {
            res.status(201).json({message: "La sauce a été modifié !"})
        })
        .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être modifié", erreur : error})})
    })
    .catch((error) => {console.log(error)})

}

exports.deleteSauce = (req, res, next) => {

    sauceSchema.findOne({_id: req.params.id})
    .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
            sauceSchema.deleteOne({_id: req.params.id})
            .then(() => {res.status(200).json({message: "La sauce a été supprimé !"})})
            .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être supprimé", erreur : error})})
        })
    })
    .catch((error) => {res.status(500).json({erreur: error})})
    
}

exports.likeSauce = (req, res, next) => {

    switch (req.body.like){
        case 1 : 
            sauceSchema.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}})
            .then(() => {res.status(201).json({message: "La sauce a été liké !"})})
            .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être liké", erreur : error})})
        break

        case -1 : 
            sauceSchema.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
            .then(() => {res.status(201).json({message: "La sauce a été disliké !"})})
            .catch((error) => {res.status(400).json({message: "La sauce n'a pas pu être disliké", erreur : error})})  
        break

        case 0 : 
            sauceSchema.findOne({_id: req.params.id})
            .then((sauceFind) => {
                if (sauceFind.usersLiked.find(user => user == req.body.userId)) {
                    sauceSchema.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}})
                    .then(() => {res.status(201).json({message: "Vous n'avez plus d'opinion pour cette sauce !"})})
                    .catch((error) => {res.status(400).json({message: "Vous n'avez pas pu modifier votre opinion pour cette sauce", erreur : error})})

                } else if (sauceFind.usersDisliked.find(user => user == req.body.userId)) {
                    sauceSchema.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                    .then(() => {res.status(201).json({message: "Vous n'avez plus d'opinion pour cette sauce !"})})
                    .catch((error) => {res.status(400).json({message: "Vous n'avez pas pu modifier votre opinion pour cette sauce", erreur : error})})
                } 
            })
            .catch((error) => {res.status(500).json({erreur: error})})
        break

        default: 
            res.status(400).json({message: "Vous ne pouvez pas proférer d'autre opinion pour cette sauce"})
    }
    
}
  