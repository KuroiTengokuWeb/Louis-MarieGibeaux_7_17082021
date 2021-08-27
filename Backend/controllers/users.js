// Importation
const db = require('../models/index');
const User = db.User;
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Crypto js
const cryptoJS = require('crypto-js');
const key = cryptoJS.enc.Hex.parse(process.env.CryptojsKEY);
const iv = cryptoJS.enc.Hex.parse(process.env.CryptojsIV);

// Création de comptes
exports.signup = (req, res, next) => {

    const passwordIsValid = req.body.password.match(/(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/)
   console.log(passwordIsValid)
   
    if(!passwordIsValid) return res.status(500).json({message : "errr"})
    
    
    // Crypt l'email
    const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    // Hashage du mot de passe avec Bcrypt + nombre de tour de hashage
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: encrypted,
            password: hash
        };
        User.create(user)
        .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
        .catch(error => res.status(400).json({ error, message: 'Une erreur est survenu, verifiez le formulaire' }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Authentification
exports.login = (req, res, next) => {
    // Crypt l'email
    const encrypted = cryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    
    // Cherche le mail dans la BDD
    User.findOne({ where: { email: encrypted } })
    .then( user => {
        // Vérifie si user existe
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé'});
        }
        // Si oui, comparer les mots de passe 
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // Si la comparaison est fausse
            if (!valid) {
                return res.status(401).json({ error: 'Mot de pass incorrect !'});
            }
          
            //Si la comparaison est vraie
            res.status(200).json({
                uid: user.id,
                isAdmin: user.isAdmin,
                // Création du token jwt
                token: jwt.sign(
                    { userId: user.id, isAdmin: user.isAdmin },
                    process.env.TOKEN,
                    { expiresIn: '24h' }
                )
                
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};

// Récupere tout les utilisateurs
// probleme? NON
exports.getAllUsers = (req, res, next) => {
    console.log(global.isAdmin);
	User.findAll({attributes: ['id', 'firstname', 'lastname', 'email', 'bio', 'imageUrl', 'isAdmin']})
	.then (data => {
        data.forEach(v => {
            //Decrypt cryptoJS encoded DATA
            v.email = cryptoJS.AES.decrypt(v.email, key, { iv: iv }).toString(cryptoJS.enc.Utf8)
        })
		res.send(data);
	})
	.catch(error => {
		res.status(500).send({ error, message: 'Impossible d\'afficher la liste des utilisateurs' })
	});
};

exports.getUserById = (req, res, next) => {
    User.findOne({
        where: { id: req.body.id }, 
       
        include: [{
            model: db.Post,
        }]
    })
    .then(user =>{
        console.log(user)
        user.email = cryptoJS.AES.decrypt(user.email, key, { iv: iv }).toString(cryptoJS.enc.Utf8)
        res.status(200).json(user)
    })
    .catch(error => res.status(404).json({ error }));
};

// Update User
exports.updateUser = (req, res, next) => {

        let user = JSON.parse(req.body.user);

        const currentFilename = user.imageUrl ? user.imageUrl.split('/images/')[1] : null ;
        user.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : user.imageUrl;

        // Si l'email est changé
        if(user.email != null) 
            // Encrypte du nouvelle email avec cryptoJS
            user.email = cryptoJS.AES.encrypt(user.email, key, { iv: iv }).toString();
        // Sinon on delete l'email de user
        else delete user.email;
    
        // Si le mdp est pas changé
        if(user.password != null){
            // Encryptage du nouveau mot de pass avec bcrypt
            user.password = bcrypt.hash(user.password, 10).then(hash => {
                user.password = hash
                // Update des changements dans la BDD
                User.update(user, { where: { id : user.id } }).then(data => {
                    if (req.file && currentFilename) {
                        // Supression de l'image précédente si une nouvelle image est choisi
                        fs.unlink(`images/${currentFilename}`, () => {
                            res.status(200).json({ imageUrl: user.imageUrl, message: 'Utilisateur modifié !' })
                        });
                    } else res.status(200).json({  imageUrl: user.imageUrl, message: 'Utilisateur modifié !' })
                }).catch(error => {res.status(500).send({ error, message: 'Impossible de modifier l\'utilisateur' }) });
            })
            .catch(error => res.status(500).json({ error }));
            console.log("email et ou mdp edit")
        } else { 
            // Si aucun mot de pass n'est rentré dans le formulaire on le delete pour eviter l'erreur 500
            delete user.password;
            // Update dans la BDD
            User.update(user, { where: { id : user.id } }).then(data => {
                if (req.file && currentFilename) {
                    // Supression de l'image précédente
                    fs.unlink(`images/${currentFilename}`, () => {
                        res.status(200).json({ imageUrl: user.imageUrl, message: 'Utilisateur modifié !' })
                    });
                } else res.status(200).json({  imageUrl: user.imageUrl, message: 'Utilisateur modifié !' })   
            }).catch(error => {res.status(501).send({ error, message: 'Impossible de modifier l\'utilisateur' }) });
            console.log('email edit pas le mdp')
        }
};

// Delete User
exports.deleteUser = (req, res, next) => {
    User.findOne({where : { id:req.body.id }})
    .then(user => {
        const currentFilename = user.imageUrl ? user.imageUrl.split('/images/')[1] : null;
        User.destroy({where: {id: req.body.id}})
        .then(response => {
            if(currentFilename)
                fs.unlink(`images/${currentFilename}`, () => {
                    res.status(200).json({ message: "Utilisateur supprimé" })
                });
            else res.status(200).json({ message: "Utilisateur supprimé" })
        })
        .catch( err => res.status(500).json({message: "Impossible de supprimer l\'Utilisateur"}))
    }) .catch(error => res.status(404).json({message: "Impossible de supprimer l\'Utilisateur"}))
        
};

//Get authenticated user
exports.getAuthenticatedUser = (req, res, next) => {

    try {

        const token = req.body.token;
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;

        User.findOne({where : { id: userId }})
        .then(response => {
            res.status(200).json(response)
        }).catch(error => res.status(401).json({ error: error | 'Requête non authentifiée !'}))
    } catch (error) {
        // problème d'identifications
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
}