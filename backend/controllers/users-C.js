// On importe le package "dotenv" pour la gestion des variables de développement
require("dotenv").config()
// On importe le package "bcrypt" qui permet de hasher des chaînes de caractères
const bcrypt = require("bcrypt")
// On importe le package "jsonwebtoken" qui créer et manipule des tokens sécurisés selon une clé secrète
const jwt = require("jsonwebtoken")
// On importe le package "crypo-js" qui permet de masquer des données selon une clé secrète
const cryptojs = require("crypto-js")
// On importe le "model" type pour les données relatives aux utilisateurs
const userSchema = require("../models/users-M")

// On exporte la fonction qui permet de créer un utilisateur
exports.signup = (req, res, next) => {

    // Ici, on crypte l'email reçu dans le corps de la requête
    const emailCrypt = cryptojs.HmacMD5(req.body.email, process.env.CRYPTO_JS_SECRET).toString()
    // Ici, on "hash" et on "sale" le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        
        // Ici, on créer un nouvelle utilisateur
        const user = new userSchema({email: emailCrypt, password: hash})
        // Ici, on le sauvegarde dans la base de donnée
        user.save()
        .then(() => {res.status(201).json({message: "Félicitation, vous venez de créer un compte !"})})
        .catch(() => {res.status(400).json({message: "Cette email est déjà utilisé par un utilisateur"})})
    })
    .catch(() => {res.status(500).json({message: "Erreur interne du serveur, veuillez réessayer plus tard"})})
    
}

// On exporte la fonction qui permet de se connecter
exports.login = (req, res, next) => {

    // Ici, on crypte l'email reçu dans le corps de la requête
    const emailCrypt = cryptojs.HmacMD5(req.body.email, process.env.CRYPTO_JS_SECRET).toString()
    // Ici, on regarde si cette email existe déjà dans la base de donnée
    userSchema.findOne({email: emailCrypt})
    .then(user => {

        // SI il n'y pas d'email correspondant ...
        if(!user){

            // On stop la requête en répondant à celle-ci
            res.status(401).json({message: "Impossible de se connecter car vous n'avez pas de compte !"})

        // SINON ...    
        } else {

            // On compare le mot de passe de la requête avec celui qui est associé à l'email qui été trouvé
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {

                // SI les deux mots de passe ne sont pas similaires ...
                if(!valid){

                    // On stop la requête en répondant à celle-ci
                    res.status(401).json({message: "Mot de passe incorrect !"})

                // SINON ...
                } else{

                    // On répond à la requête en envoyant un token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, process.env.JWT_TOKEN, {expiresIn: "24h"})
                    })
                }
            })
            .catch(() => {res.status(500).json({message: "Erreur interne du serveur, veuillez réessayer plus tard"})})
        }
    })
    .catch(() => {res.status(500).json({message: "Erreur interne du serveur, veuillez réessayer plus tard"})})
}