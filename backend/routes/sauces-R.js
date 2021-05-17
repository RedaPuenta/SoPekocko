// On importe le package "express" et on stock l'exécution du router
const express = require("express")
const router = express.Router()
// On importe le controller qui contient la logique CRUD
const sauceController = require("../controllers/sauces-C")
// On importe le middleware qui contient la sécurité d'authentification
const auth = require("../middleware/auth")
// On importe le middleware qui permet de charger les images des requêtes "multipart/form-data"
const multerUpload = require("../middleware/multer-config")
// On importe le middleware qui valide les données de formulaire relatives aux sauces
const sauceVerif = require("../middleware/sauceVerif")

// On définie toutes les routes nécessaire au fonctionnement de l'API
router.get("/", auth, sauceController.getAllSauce)
router.get("/:id", auth, sauceController.getOneSauce)
router.post("/", auth, multerUpload, sauceVerif, sauceController.createSauce)
router.put("/:id", auth, multerUpload, sauceVerif, sauceController.modifySauce)
router.delete("/:id", auth, sauceController.deleteSauce)
router.post("/:id/like", auth, sauceController.likeSauce)

// On exporte router EXPRESS pour que l'application EXPRESS puisse s'en servir
module.exports = router