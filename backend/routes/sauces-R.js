const express = require("express")
const router = express.Router()

const sauceController = require("../controllers/sauces-C")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

router.get("/", auth, sauceController.getAllSauce)
router.get("/:id", auth, sauceController.getOneSauce)
router.post("/", auth, multer, sauceController.createSauce)
router.put("/:id", auth, multer, sauceController.modifySauce)
router.delete("/:id", auth, multer, sauceController.deleteSauce)
router.post("/:id/like", auth, sauceController.likeSauce)

module.exports = router