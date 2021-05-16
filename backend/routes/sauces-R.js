const express = require("express")
const router = express.Router()

const sauceController = require("../controllers/sauces-C")
const auth = require("../middleware/auth")
const multerUpload = require("../middleware/multer-config")
const sauceVerif = require("../middleware/sauceVerif")

router.get("/", auth, sauceController.getAllSauce)
router.get("/:id", auth, sauceController.getOneSauce)
router.post("/", auth, multerUpload, sauceVerif, sauceController.createSauce)
router.put("/:id", auth, multerUpload, sauceVerif, sauceController.modifySauce)
router.delete("/:id", auth, sauceController.deleteSauce)
router.post("/:id/like", auth, sauceController.likeSauce)

module.exports = router