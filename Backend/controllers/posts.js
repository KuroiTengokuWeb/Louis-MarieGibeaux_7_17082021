// Importation
const db = require('../models/index');
const Post = db.Post;
const fs = require('fs');

// Exports des méthodes

// Création d'une Post
exports.createPost = (req, res, next) => {
    let post = JSON.parse(req.body.post);
    post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    post.userId = req.body.userId;
    
    //enregistre dans la BDD
     Post.create(post)
         // Renvoi un status positive 201
         .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
         // error = error : error
         .catch(error => res.status(400).json({ error, message: 'Erreur lors de la creation du post' }));
};

// Recupere une post
exports.getPostById = (req, res, next) => {
    Post.findOne({
        where: { id: req.body.id }, 
            include: [{
                model: db.User,
                attributes: ['id', 'lastname', 'firstname', 'imageUrl']
            }, { model:db.likePost }
        ]
    })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({ error }));
};


// Récupere tout les posts
exports.getAllPosts = (req, res, next) => {
	Post.findAll({
        include: [{
                model: db.User,
                attributes: ['id', 'lastname', 'firstname', 'imageUrl']
            },
            { model:db.likePost }
        ]
    })
	.then (data => res.status(200).json(data))
	.catch(error => {res.status(500).send({ error, message: 'Impossible d\'afficher la liste des posts' }) });
};

// Modifier un Post
exports.updatePost = (req, res, next) => {
    let post = JSON.parse(req.body.post);
    const currentFilename = post.imageUrl.split('/images/')[1];
    post.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : post.imageUrl;

    Post.update(post, { where: { id : post.id } }).then(data => {
         if (req.file) {
            // Supression de l'image précédente
            fs.unlink(`images/${currentFilename}`, () => {
                res.status(200).json({ imageUrl: post.imageUrl, message: 'Objet modifié !' })
            });
        } else res.status(200).json({  imageUrl: post.imageUrl, message: 'Objet modifié !' })
                    
    }).catch(error => {res.status(500).send({ error, message: 'Impossible d\'afficher la liste des posts' }) });
};

// Supprime une post
exports.deletePost = (req, res, next) => {
    Post.findOne({
        where: { id: req.body.id },
        include: [{
            model: db.Comment,
            attributes: ['imageUrl']
        }]
    })
    .then(post => {
        Post.destroy({where: {id: post.id}})
        .then(response => {
            // Récupération du nom de l'image
            const currentFilename = post.imageUrl.split('/images/')[1];
            // Suppression de l'image
            fs.unlink(`images/${currentFilename}`, () => {
                //Parcours les commentaires du post pour la suppression des images
                post.Comments.forEach((comment) => {
                    if(comment.imageUrl){
                        let commentFilename = comment.imageUrl.split('/images/')[1]
                        fs.unlink(`images/${commentFilename}`, () => {})
                    }
                });
               
                res.status(200).json({ message: "Objet supprimé" })
            });
            
        })
        .catch( err => res.status(500).json({message: "Une erreur est survenue"}))
    })
    .catch(error => res.status(404).json({ error }));
};

////////////////////////////////////////////////////////////////

