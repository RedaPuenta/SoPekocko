// On importe le package "multer" qui permet de gérer les requêtes "multipart/form-data"
const multer = require("multer")

// On définie les types MIME pour définir types d'images gérer par l'API
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
}

// On définie la fonction de "multer" qui permet de télécharger les fichiers
const storage = multer.diskStorage({

    destination: (req, file, callback) => {
        callback(null, "images")
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + "." + extension)
    }
})

// On exporte ce middleware
module.exports = multer({ storage }).single("image")