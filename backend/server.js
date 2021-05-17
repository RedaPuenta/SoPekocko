// On importe le package "dotenv" pour la gestion des variables de développement
require("dotenv").config
// On importe le package "http" pour la création du serveur
const http = require('http')
// On importe l'application EXPRESS
const app = require('./app')

// La fonction "normalizePort" renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne de caractère
const normalizePort = val => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
};

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// La fonction "errorHandler" recherche les différentes erreurs et les gère de manière appropriée en les enrengistrant dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.')
      process.exit(1)
      break;
    default:
      throw error
  }
};

// Création du serveur HTTP avec l'application EXPRESS
const server = http.createServer(app)

// Un écouteur d'évènement est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler)
server.on('listening', () => {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
  console.log('Listening on ' + bind)
})

// Ecoute du serveur sur un port
server.listen(port)
    