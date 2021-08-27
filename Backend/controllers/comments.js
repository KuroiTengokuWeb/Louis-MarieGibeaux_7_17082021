// Importation
// Pourquoi User?
const { User } = require('../models/index');
const db = require('../models/index');
const Comment = db.Comment;
const fs = require('fs');

// Exports des méthodes

// Création d'une Comment
exports.createComment = (req, res, next) => {
    let comment = JSON.parse(req.body.comment);
    comment.imageUrl =  req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    comment.userId = req.body.userId;
    
    //enregistre dans la BDD
    Comment.create(comment)
        // Renvoi un status positive 201
         .then(() => res.status(201).json({ message: 'Commentaire enregistré !' }))
         // error = error : error
         .catch(error => res.status(400).json({  message: 'Impossible de créer le commentaire' }));
};

// Récupere tout les commentaires
exports.getAllComments = (req, res, next) => {
	Comment.findAll({
        where : {postId: req.body.id},
        include: [{
            model: User,
            attributes: ['id', 'lastname', 'firstname', 'imageUrl']
        }, { model:db.likeComment }]
    })
	.then (data => res.status(200).json(data))
	.catch(error => {res.status(500).send({ error, message: 'Impossible d\'afficher la liste des commentaires' }) });
};

// Modifier une Comment
exports.updateComment = (req, res, next) => {
    let comment = JSON.parse(req.body.comment);

    const currentFilename = comment.imageUrl ? comment.imageUrl.split('/images/')[1] : null ;
    comment.imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : comment.imageUrl;

    Comment.update(comment, { where: { id : comment.id } }).then(data => {
        if (req.file && currentFilename) {
            // Supression de l'image précédente
            fs.unlink(`images/${currentFilename}`, () => {
                res.status(200).json({ imageUrl: comment.imageUrl, message: 'Commentaire modifié !' })
            });
        } else res.status(200).json({  imageUrl: comment.imageUrl, message: 'Commentaire modifié !' })
               
    }).catch(error => {res.status(500).send({ error, message: 'Impossible de modifier le commentaire' }) }); 
};


// Supprime une Comment
exports.deleteComment = (req, res, next) => {
    Comment.findOne({where : { id:req.body.id }})
    .then(comment => {
        const currentFilename = comment.imageUrl ? comment.imageUrl.split('/images/')[1] : null;
        Comment.destroy({where: {id: req.body.id}})
        .then(response => {
            if(currentFilename)
                fs.unlink(`images/${currentFilename}`, () => {
                    res.status(200).json({ message: "Commentaire supprimé" })
                });
            else res.status(200).json({ message: "Commentaire supprimé" })
        })
        .catch( err => res.status(500).json({message: "Impossible de supprimer le commentaire"}))
    }) .catch(error => res.status(404).json({message: "Impossible de supprimer le commentaire"}))
};
