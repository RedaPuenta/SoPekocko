const express = require("express")
const router = express.Router()

const userController = require("../controllers/users-C")
const signupVerif = require("../middleware/signupVerif")

router.post("/signup", signupVerif.emailVerif, signupVerif.passwordVerif, signupVerif.uniqueEmailVerif, userController.signup)
router.post("/login", userController.login)

module.exports = router