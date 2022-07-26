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

// Creation of the Express application

const app = express();

// Express middleware that parses incoming JSON requests and puts parsed data into req.body

app.use(express.json());

// Middleware - add access control headers for all response objects

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Manage the "images" resource statically

app.use('/images', express.static(path.join(__dirname, 'images')));

//Routes

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/posts', likeRoutes);

module.exports = app;