// On importe le package "mongoose" pour la base de donnée
const mongoose = require("mongoose")
// On importe le package "mongoose-unique-validator" qui force l'unicité des éléments qui doivent être unique
const mongooseValidator = require("mongoose-unique-validator")

// On définie un "schéma" type pour les données relatives aux utilisateurs
const userSchema = mongoose.Schema({
    
    email: {type: String, require: true, unique: true},
    password: {type: String, require: true}

})

// On associe au "schéma" le plugin qui assure l'unicité de l'email
userSchema.plugin(mongooseValidator)

// On exporte le "schéma" pour que le controller qui contient la logique CRUD puisse l'utiliser
module.exports = mongoose.model("userSchema", userSchema)