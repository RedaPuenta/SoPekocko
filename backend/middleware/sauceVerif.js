// On importe le package "fs" pour la gestion des fichiers
const fs = require("fs")

// On exporte le middleware qui permet de vérifier si les champs de formulaires ne contiennent pas "d'injection"
module.exports = (req, res, next) => {
    
    // SI la requête contient une nouvelle image ...
    if(req.file){
        var sauceReq = JSON.parse(req.body.sauce)

    // SINON ...
    } else {
        var sauceReq = req.body
    }

    // On déclare la fonction qui permet de supprimer l'image qui a été télécharger dans le middleware précedemment (si injection champ formulaire)
    function deleteImage() {
        if(req.file) {
            fs.unlink(`images/${req.file.filename}`, (err) => {
                if (err) throw err
            })
        }  
    }
    
    // On déclare les caractères non autorisés dans les champs du formulaire (anti-injection)
    const regex = /[<=>)(}{:;#_|+^*~$"]/

    // SI il y a un caractère non autorisé dans le champ "name" du formulaire ...
    if (regex.test(sauceReq.name)) {

        // On supprimer l'image qui a été précedemment téléchargé par multer
        deleteImage()
        // On répond à la requête en indiquant le champ qui n'est pas valide
        res.status(400).json({message: "Certains caractères du champ de saisie 'name' ne sont pas acceptable"})
    
    // ...
    } else if (regex.test(sauceReq.manufacturer)) {

        deleteImage()

        res.status(400).json({message: "Certains caractères du champ de saisie 'manufacturer' ne sont pas acceptable"})
    
    // ...
    } else if (regex.test(sauceReq.description)) {

        deleteImage()

        res.status(400).json({message: "Certains caractères du champ de saisie 'description' ne sont pas acceptable"})
    
    // ...
    } else if (regex.test(sauceReq.mainPepper)) {

        deleteImage()

        res.status(400).json({message: "Certains caractères du champ de saisie 'mainPepper' ne sont pas acceptable"})
    
    // ...
    } else if (regex.test(sauceReq.heat)) {

        deleteImage()

        res.status(400).json({message: "Certains caractères du champ de saisie 'heat' ne sont pas acceptable"})

    // SINON ...
    } else {

        // On passe au middleware suivant
        next()
    }
    
}

