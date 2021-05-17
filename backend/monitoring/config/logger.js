const appRootPath = require("app-root-path")
const morgan = require("morgan")
const fs = require("fs")

module.exports = morgan((morganStyle, req, res) => {

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let secondes = date.getSeconds()
    let msecondes = date.getMilliseconds()

    let log = `Le ${day}/${month}/${year} à ${hours}:${minutes}:${secondes}:${msecondes} [${req.ip}] [${req.method}] ${req.protocol}://${req.get('host')}${req.originalUrl} [${res.statusCode}-${res.statusMessage}]`
    let logWithMail = `Le ${day}/${month}/${year} à ${hours}:${minutes}:${secondes}:${msecondes} [${req.ip}] [${req.method}] ${req.protocol}://${req.get('host')}${req.originalUrl} [${res.statusCode}-${res.statusMessage}] [${req.body.email}]`
    let logWithSauce = `Le ${day}/${month}/${year} à ${hours}:${minutes}:${secondes}:${msecondes} [${req.ip}] [${req.method}] ${req.protocol}://${req.get('host')}${req.originalUrl} [${res.statusCode}-${res.statusMessage}] [${req.body.sauce}]`

    if(parseInt(res.statusCode) >= 500){
        fs.appendFile(`${appRootPath}/monitoring/logs/error_serveur.log`, log + "\n", (error) => {
            if (error) console.log(error)
        })
    } else {
        if(req.method !== "OPTIONS"){
            if(parseInt(res.statusCode) < 400) {
                fs.appendFile(`${appRootPath}/monitoring/logs/stabilize_activity.log`, log + "\n", (error) => {
                    if (error) console.log(error)
                })
            } else {
                if(req.body.email) {
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, logWithMail + "\n", (error) => {
                        if (error) console.log(error)
                    })
                } else if (req.body.sauce){
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, logWithSauce + "\n", (error) => {
                        if (error) console.log(error)
                    })
                } else {
                    fs.appendFile(`${appRootPath}/monitoring/logs/suspicious_activity.log`, log + "\n", (error) => {
                        if (error) console.log(error)
                    })
                }
                
            }
            
        }
    }
 
})