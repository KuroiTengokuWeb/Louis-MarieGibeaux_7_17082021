// Importation
const db = require('../models/index');
const like = db.likePost;

/////////////////////////
// create Like/Dislike post
exports.likePost = (req, res, next) => {
    like.create(req.body)
         // Renvoi un status positive 201
         .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
         // error = error : error
         .catch(error => res.status(400).json({ error, message: 'Erreur lors de la creation du like' }));
};

/////////////////////////
// update Like/Dislike post
exports.updateLikePost = (req, res, next) => {
    like.update(req.body, { where: { id : req.body.id } })
    .then(data => res.status(200).json({  message: 'Objet modifié !' }))
    .catch(error => {res.status(500).send({ error, message: 'Impossible de modifier le like' }) });
};


/////////////////////////
// update Like/Dislike post
exports.deleteLikePost = (req, res, next) => {

    like.destroy({ where: { id : req.body.id } })
    .then(data => res.status(200).json({  message: 'Objet modifié !' }))
    .catch(error => {res.status(500).send({ error, message: 'Impossible de modifier le like' }) });
};


/////////////////////////
// create Like/Dislike post
exports.likeComment = (req, res, next) => {
    db.likeComment.create(req.body)
         // Renvoi un status positive 201
         .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
         // error = error : error
         .catch(error => res.status(400).json({ error, message: 'Erreur lors de la creation du like' }));
};

/////////////////////////
// update Like/Dislike post
exports.updateLikeComment = (req, res, next) => {
    db.likeComment.update(req.body, { where: { id : req.body.id } })
    .then(data => res.status(200).json({  message: 'Objet modifié !' }))
    .catch(error => {res.status(500).send({ error, message: 'Impossible de modifier le like' }) });
};


/////////////////////////
// update Like/Dislike post
exports.deleteLikeComment = (req, res, next) => {

    db.likeComment.destroy({ where: { id : req.body.id } })
    .then(data => res.status(200).json({  message: 'Objet modifié !' }))
    .catch(error => {res.status(500).send({ error, message: 'Impossible de modifier le like' }) });
};
