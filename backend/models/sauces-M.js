const mongoose = require("mongoose")

const sauceSchema = mongoose.Schema({
    
    userId: {type: String, require: true},
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    imageUrl: {type: String, require: true},
    heat: {type: Number, require: true},
    likes: {type: Number, require: false, default: 0},
    dislikes: {type: Number, require: false, default: 0},
    usersLiked: {type: Array, require: false},
    usersDisliked: {type: Array, require: false}

})

module.exports = mongoose.model("sauceSchema", sauceSchema)