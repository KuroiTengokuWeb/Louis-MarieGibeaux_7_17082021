// Importations
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const likeCtrl = require('../controllers/likes');

// Like - dislike un post
router.post('/likePost', likeCtrl.likePost);
// Like - dislike un post
router.put('/updateLikePost', likeCtrl.updateLikePost);
// Like - dislike un post
router.post('/deleteLikePost', likeCtrl.deleteLikePost);

// Like - dislike un comment
router.post('/likeComment', likeCtrl.likeComment);
// Like - dislike un comment
router.put('/updateLikeComment', likeCtrl.updateLikeComment);
// Like - dislike un comment
router.post('/deleteLikeComment', likeCtrl.deleteLikeComment);

module.exports = router;