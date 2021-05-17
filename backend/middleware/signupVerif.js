// On importe le "model" type pour les données relatives aux utilisateurs
const userSchema = require("../models/users-M")
// On importe le package "crypo-js" qui permet de masquer des données selon une clé secrète
const cryptojs = require("crypto-js")

// On exporte le middleware qui vérifie l'unicité d'un email afin de répondre plus vite à mauvaise requête (signup)
exports.uniqueEmailVerif = (req, res, next) => {
    
    // Ici, on crypte l'email reçu dans le corps de la requête
    const emailCrypt = cryptojs.HmacMD5(req.body.email, process.env.CRYPTO_JS_SECRET).toString()
    // Ici, on regarde si cette email existe déjà dans la base de donnée
    userSchema.findOne({email: emailCrypt})
    .then((find) => {

        // SI cette email existe pas ...
        if(find === null) {

            // On exécute le middleware suivant
            next()

        // SINON ...
        } else {

            // On stop la requête en répondant à celle-ci
            res.status(400).json({message: "Cette email est déjà utilisé par un utilisateur"})
        }
    })
    .catch(() => {res.status(500).json({message: "Erreur lié au serveur"})})

}

// On exporte le middleware qui vérifie que l'email est valide
exports.emailVerif = (req, res, next) => {

    // Ici, on capture l'email qui se trouve dans le corp de la requête
    const emailReq = req.body.email
    // Ici, on définie le regex qui correspond à un email valide
    const regexEmail = new RegExp('^[a-z0-9._%+-]{2,}[@]{1}[a-z0-9.-]{2,}[.]{1}[a-z]{2,3}$', 'g')

    // SI l'email n'est pas en opposition avec le regex ...
    if(emailReq.match(regexEmail)) {

        // On exécute le middleware suivant
        next()

    // SINON ...
    } else {

        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "L'email ne semble pas valide"})
        
    }
}

// On exporte le middleware qui vérifie que le mot de passe est assez fort
exports.passwordVerif = (req, res, next) => {

    // Ici, on capture le mot de passe qui se trouve dans le corp de la requête
    const passwordReq = req.body.password

    // SI le mot de passe n'a pas au moins une MAJUSCULE ...
    if (!/[A-Z]/.test(passwordReq)) {

        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 majuscule"})
    
    // SINON SI le mot de passe n'a pas au moins une MINUSCULE ...
    } else if (!/[a-z]/.test(passwordReq)) {

        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 minuscule"})
    
    // SINON SI le mot de passe n'a pas au moins un CHIFFRE ...
    } else if (!/[0-9]/.test(passwordReq)) {

        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 chiffre"})

    // SINON SI le mot de passe n'a pas au moins un CARACTERE SPECIAL ...
    } else if (!/[@$!%*?&.']/.test(passwordReq)) {
        
        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "Le mot de passe doit contenir au moins 1 caractère spéciale (@$!%*?&.')"})
    
    // SINON SI le mot de passe contient moins de 8 CARACTERES ...
    } else if(passwordReq.length < 8) {

        // On stop la requête en répondant à celle-ci
        res.status(400).json({message : "Le mot de passe doit contenir au moins 8 caractères"})
    
    // SINON ...
    }  else {

        // On exécute le middleware suivant
        next()

    }
    
}