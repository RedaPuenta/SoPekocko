require('dotenv').config()
const express = require("express")
const app = express()

const mongoose = require("mongoose")
const path = require("path")
const helmet = require("helmet")

const rateLimit = require("express-rate-limit")
const limiterForLogin = rateLimit({windowMs: 15 * 60 * 1000, max: 10, message: "Vous avez effectué trop de tentative, vous pourrez réessayer dans 15 min"})

const userRoute = require("./routes/users-R")
const sauceRoute = require('./routes/sauces-R')

app.use(helmet())

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next();
});

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use("/api/auth", limiterForLogin, userRoute)
app.use("/api/sauces", sauceRoute)

module.exports = app