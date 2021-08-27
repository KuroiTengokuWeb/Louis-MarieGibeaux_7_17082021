const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer.config');
const commentCtrl = require('../controllers/comments');

// Toute les routes en post ou put car sinon on ne peut 
// pas envoyer et recevoir des datas dans le body.
// Ce qui va bloquer le middleware Auth
// ps : MERCI MYSQL ET SEQUELIZE ( pls never use it again !)

// Récupérer tous les comments
router.post('/getAllComments', auth, commentCtrl.getAllComments);

// Créer un nouveau comments
router.post('/createComment', auth, multer, commentCtrl.createComment);

// Mettre à jour un comments
router.put('/updateComment', auth, multer, commentCtrl.updateComment);

// Supprimer un comments
router.post('/deleteComment', auth, commentCtrl.deleteComment);


module.exports = router;