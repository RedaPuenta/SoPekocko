// On importe le package "express" et on stock l'exécution du router
const express = require("express")
const router = express.Router()
// On importe le controller qui contient toute la logique d'auhentification
const userController = require("../controllers/users-C")
// On importe le middleware qui valide les données de formulaire relatives à l'authentification
const signupVerif = require("../middleware/signupVerif")

// On définie toutes les routes nécessaire au fonctionnement de l'API
router.post("/signup", signupVerif.uniqueEmailVerif, signupVerif.emailVerif, signupVerif.passwordVerif, userController.signup)
router.post("/login", userController.login)

// On exporte router EXPRESS pour que l'application EXPRESS puisse s'en servir
module.exports = router