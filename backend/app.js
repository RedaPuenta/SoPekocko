const express = require("express")
const app = express()

const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const userRoute = require("./routes/users-R")

mongoose.connect('mongodb+srv://adminUse:tUnGA2CfdDvsdSoH@cluster0.k6xtg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json())

app.use("/api/auth", userRoute)

module.exports = app