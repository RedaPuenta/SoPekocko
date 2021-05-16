module.exports = (req, res, next) => {

    const sauceReq = JSON.parse(req.body.sauce)
    const regex = /[<=>)(}{:;#_|+-^*`~$"]/

    if (regex.test(sauceReq.name)) {

        res.status(400).json({message: "Certains caractères du champ de saisie 'name' ne sont pas acceptable"})

    } else if (regex.test(sauceReq.manufacturer)) {

        res.status(400).json({message: "Certains caractères du champ de saisie 'manufacturer' ne sont pas acceptable"})

    } else if (regex.test(sauceReq.description)) {

        res.status(400).json({message: "Certains caractères du champ de saisie 'description' ne sont pas acceptable"})

    } else if (regex.test(sauceReq.mainPepper)) {

        res.status(400).json({message: "Certains caractères du champ de saisie 'mainPepper' ne sont pas acceptable"})

    } else if (regex.test(sauceReq.heat)) {

        res.status(400).json({message: "Certains caractères du champ de saisie 'heat' ne sont pas acceptable"})

    } else {

        next()
    }
    
}

