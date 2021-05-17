// On importe le package "mongoose" pour la base de donnée
const mongoose = require("mongoose")

// On définie un "schéma" type pour les données relatives aux sauces
const sauceSchema = mongoose.Schema({
    
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, require: true, default: 0},
    dislikes: {type: Number, require: true, default: 0},
    usersLiked: {type: Array, require: true},
    usersDisliked: {type: Array, require: true}

})

// On exporte le "schéma" pour que le controller qui contient la logique CRUD puisse l'utiliser
module.exports = mongoose.model("sauceSchema", sauceSchema)