// On importe le package "app-root-path" qui permet de remonter à la racine d'un disque dur
const appRootPath = require("app-root-path")
// On importe le package "app-root-path" qui permet de capturer l'aboutissement de chaque requêtes
const morgan = require("morgan")
// On importe le package "fs" pour la gestion des fichiers
const fs = require("fs")

// On exporte la configuration qui écrit des logs pour chaque requêtes
module.exports = morgan((morganStyle, req, res) => {

    // Ici, on définie des informations relatives au temps
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let secondes = date.getSeconds()
    let msecondes = date.getMilliseconds()

    // Ici, on définie un type de log général (base)
    let log = `Le ${day}/${month}/${year} à ${hours}:${minutes}:${secondes}:${msecondes} [${req.ip}] [${req.method}] ${req.protocol}://${req.get('host')}${req.originalUrl} [${res.statusCode}-${res.statusMessage}]`
    // Ici, on définie deux types de log spécifique (base + information complémentaire)
    let logWithMail = log + ` [${req.body.email}]`
    let logWithSauce = log + ` [${req.body.sauce}]`

    // SI la code de statut de la requête est supérieur ou égal à 500 ...
    if(parseInt(res.statusCode) >= 500){

        // On écrit un log (base) dans le fichier "error_serveur.log"
        fs.appendFile(`${appRootPath}/monitoring/logs/error_serveur.log`, log + "\n", (error) => {
            if (error) console.log(error)
        })

    // SINON ...
    } else {

        // SI la méthode de la requête est différente de "OPTIONS" ...
        if(req.method !== "OPTIONS"){

            // SI le code de statut de la requête est strictement inférieur à 400 ...
            if(parseInt(res.statusCode) < 400) {

                // On écrit un log (base) dans le fichier "stabilize_activity.log"
                fs.appendFile(`${appRootPath}/monitoring/logs/stabilize_activity.log`, log + "\n", (error) => {
                    if (error) console.log(error)
                })
            
            // SINON ...
            } else {

                // SI le corps de la requête contient un clé "email" ...
                if(req.body.email) {

                    // On écrit un log spécifique (avec email du formulaire) dans le fichier "suspicious_activity.log"
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, logWithMail + "\n", (error) => {
                        if (error) console.log(error)
                    })

                // SINON, SI le corps de la requête contient une clé "sauce" ...    
                } else if (req.body.sauce){

                    // On écrit un log spécifique (avec données du formulaire) dans le fichier "suspicious_activity.log"
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, logWithSauce + "\n", (error) => {
                        if (error) console.log(error)
                    })
                
                // SINON, SI le corps de la requête contient une clé "sauce" ... 
                } else {

                    // On écrit un log (base) dans le fichier "suspicious_activity.log"
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, log + "\n", (error) => {
                        if (error) console.log(error)
                    })
                }
                
            }
            
        }
    }
 
})