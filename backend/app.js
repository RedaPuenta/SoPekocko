// On importe le package "dotenv" pour la gestion des variables de développement
require('dotenv').config()
// On importe le package "express" et on stock son exécution dans une variable "application"
const express = require("express")
const app = express()
// On importe le package "mongoose" pour la base de donnée
const mongoose = require("mongoose")
// On importe le package "path" natif à NODE JS pour la gestion des chemins
const path = require("path")
// On importe le package "helmet" pour définir des en-têtes de sécurité
const helmet = require("helmet")
// On importe le package "express-rate-limit" pour contrôler les limites de requête
const rateLimit = require("express-rate-limit")
// On importe la configuration qui écrit des logs pour chaque requêtes
const logger = require("./monitoring/config/logger")
// 0n importe la route "user" qui gère --> signup/login
const userRoute = require("./routes/users-R")
// 0n importe la route "user" qui gère --> CRUD
const sauceRoute = require('./routes/sauces-R')

// On configure les limites de requêtes (10 requête pour 15 minutes)
const limiterForLogin = rateLimit({windowMs: 15 * 60 * 1000, max: 10, message: "Vous avez effectué trop de tentative, vous pourrez réessayer dans 15 min"})

// On utilise "helmet" avec 11 fonctions sur 15 d'active
app.use(helmet())

// On se connecte à la base de donnée
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'))

// On définie les en-têtes des requêtes qui sont nécessaires au fonctionnement de l'API
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// On utilise "parse" automatiquement le corps des requêtes pour les formats "application/x-www-form-urlencoded" et les formats "application/json"
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// On utilise le logger qui capture et écrit les logs pour chaque requêtes
app.use(logger)

// On utilise le chemin "/images/" pour les images en lui associant le dossier de stockage
app.use('/images', express.static(path.join(__dirname, 'images')))
// On utilise le chemin "/api/auth" pour les signup/login en lui associant la route destiné
app.use("/api/auth", limiterForLogin, userRoute)
// On utilise le chemin "/api/sauces" pour le CRUD en lui associant la route destiné
app.use("/api/sauces", sauceRoute)

// On export l'application EXPRESS pour que le serveur puisse tourner dessus
module.exports = app