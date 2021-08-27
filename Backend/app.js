// Importations
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mysql = require('mysql2');
const db = require('./models/index');


const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');

////////////////////
// GLOBALS
global.isAdmin = false;

// Création de l'app
const app = express();

// Helmet
app.use(helmet());

// Connexion à la BDD
db.sequelize.sync().then(result => {
  console.log('co db');
}).catch( error =>  { console.log(error )});

// middleware définition des headers pour les requêtes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// middleware qui transforme le corps des requetes en JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware acces statiques aux images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation des routes
app.use('/api', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likesRoutes);

// Exportation de l'app pour l'utilisation dans d'autres fichiers
module.exports = app;