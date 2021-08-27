// Importations
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer.config');
const userCtrl = require('../controllers/users');

// Toute les routes en post ou put car sinon on ne peut 
// pas envoyer et recevoir des datas dans le body.
// Ce qui va bloquer le middleware Auth
// ps : MERCI MYSQL ET SEQUELIZE ( pls never use it again !)

// S'inscrire
router.post('/auth/signup', userCtrl.signup);

// Se connecter
router.post('/auth/login', userCtrl.login);

// Get all users
router.post('/auth/getAllUsers', auth, userCtrl.getAllUsers);

// Update user
router.put('/auth/updateUser/', auth, multer, userCtrl.updateUser);

// delete user
router.post('/auth/deleteUser', auth, userCtrl.deleteUser);

// refresh user
router.post('/auth/getAuthenticatedUser', userCtrl.getAuthenticatedUser);

//Get user
router.post('/auth/getUser', auth, userCtrl.getUserById);



// Voir son compte
//router.get('/users/:id', auth, userCtrl.getMyAccount);

// Modifier son compte
//router.put('/users/:id', auth, userCtrl.updateMyAccount);

// Supprimer son compte
//router.delete('/users/:id', auth, userCtrl.deleteMyAccount);



// Les routes 'admin'

// Voir la liste des utilisateurs
//router.get('/dashboard/users', auth, userCtrl.getAllUsers);

// Voir les informations d'un utilisateur
//router.get('/dashboard/users/:id', auth, userCtrl.getUser);

// Supprimer le compte d'un utilisateur
//router.delete('/dashboard/users/:id', auth, userCtrl.deleteUser);

module.exports = router;