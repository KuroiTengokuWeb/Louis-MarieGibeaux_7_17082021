// Importations
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer.config');
const postCtrl = require('../controllers/posts');

// Toute les routes en post ou put car sinon on ne peut 
// pas envoyer et recevoir des datas dans le body.
// Ce qui va bloquer le middleware Auth
// ps : MERCI MYSQL ET SEQUELIZE ( pls never use it again !)

// Récupérer tous les posts
router.post('/getAllPosts', auth, postCtrl.getAllPosts);

// Récupérer un post
router.post('/getPost',  auth, postCtrl.getPostById);

// Créer un nouveau post
router.post('/createPost', auth, multer, postCtrl.createPost);

// Mettre à jour un post
router.put('/updatePost', auth, multer, postCtrl.updatePost);

// Supprimer un post
router.post('/deletePost', auth, postCtrl.deletePost);


module.exports = router;