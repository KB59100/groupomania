require("dotenv").config();
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');


let root =process.env.DB_USER_NAME;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;
let host =  process.env.DB_HOST;

// Creation express

const app = express();

// Middleware express qui analyse les requêtes JSON entrantes et place les données analysées dans req.body
app.use(express.json());

// Middleware - ajouter des en-têtes de contrôle d'accès pour tous les objets de réponse

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Gérer la ressource "images" de manière statique

app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/posts', likeRoutes);

module.exports = app;