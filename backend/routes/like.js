// Imports

const express = require('express');
const auth = require('../middleware/auth');
const likeCtrl = require('../controllers/like');

// Création du routeur Express

const router = express.Router();

// Création des routes

router.post('/:id/like', auth, likeCtrl.like);

// Exports

module.exports = router;