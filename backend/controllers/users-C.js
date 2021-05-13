require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = require("../models/users-M")

exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        const user = new userSchema({email: req.body.email, password: hash})
        user.save()
        .then(() => {res.status(201).json({message: "Utilisateur créé !"})})
        .catch((error) => {json({message: "L'adresse mail utilisée existe déjà", erreur: error})})
    })
    .catch((error) => {res.status(500).json({message: "Problème lié au serveur", erreur: error})})

}

exports.login = (req, res, next) => {

    userSchema.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({message: "Utilisateur non trouvé !"})
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({message: "Mot de passe incorrect !"})
                } else{
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, process.env.JWT_TOKEN, {expiresIn: "24h"})
                    })
                }
            })
            .catch((error) => {res.status(500).json({message: "Problème lié au serveur", erreur: error})})
        }
    })
    .catch((error) => {res.status(500).json({message: "Problème lié au serveur", erreur: error})})
}