// On importe le package "dotenv" pour la gestion des variables de développement
require("dotenv").config()
// On importe le package "jsonwebtoken" qui créer et manipule des tokens sécurisés selon une clé secrète
const jwt = require("jsonwebtoken")

// On exporte le middleware qui vérifie l'authenticité des tokens utilisateurs
module.exports = (req, res, next) => {
    
    try {

        // Ici, on capture le token de l'utilisateur
        const token = req.headers.authorization.split(" ")[1]
        // Ici, on décode le token par rapport à la clé secrète et universelle associer à tout les tokens
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN)
        // Ici, dans le token décodé, on capture le "userId" qui était dissimulé
        const userId = decodedToken.userId

        // SI le corps de la requête contient un "userId" et que ce "userId" est différent de celui qui a été décodé
        if(req.body.userId && req.body.userId !== userId){

            // On stop la requête en répondant à celle-ci
           res.status(498).json({message: "Le token est expiré ou invalide"})
        
        // SINON ...
        } else{

            // On exécute le middleware suivant
            next()
        }

    } catch (error) {
        res.status(500).json({message: "Erreur interne du serveur, veuillez réessayer plus tard"})
        console.error(error)
    }
}