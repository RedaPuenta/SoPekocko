const userSchema = require("../models/users-M")
const cryptojs = require("crypto-js")

exports.uniqueEmailVerif = (req, res, next) => {
    
    const emailCrypt = cryptojs.HmacMD5(req.body.email, process.env.CRYPTO_JS_SECRET).toString()
    userSchema.findOne({email: emailCrypt})
    .then((find) => {
        if(find === null) {
            next()
        } else {
            res.status(400).json({message: "Cette email est déjà utilisé par un utilisateur"})
        }
    })
    .catch((error) => {res.status(500).json({message: "Erreur lié au serveur", erreur: error})})

}

exports.emailVerif = (req, res, next) => {

    const emailReq = req.body.email
    const regexEmail = new RegExp('^[a-z0-9._%+-]{2,}[@]{1}[a-z0-9.-]{2,}[.]{1}[a-z]{2,3}$', 'g')

    if(emailReq.match(regexEmail)) {

        next()

    } else {

        res.status(400).json({message : "L'email ne semble pas valide"})
        
    }
}

exports.passwordVerif = (req, res, next) => {

    const passwordReq = req.body.password

    if (!/[A-Z]/.test(passwordReq)) {

        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 majuscule"})

    } else if (!/[a-z]/.test(passwordReq)) {

        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 minuscule"})

    } else if (!/[0-9]/.test(passwordReq)) {

        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 chiffre"})

    } else if (!/[@$!%*?&.']/.test(passwordReq)) {

        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 caractère spéciale (@$!%*?&.')"})

    } else if(passwordReq.length < 8) {

        res.status(400).json({message : "Le mot de passe doit contenir au moins 8 caractères"})

    }  else {

        next()

    }
    
}