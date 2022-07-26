// Imports

const express = require('express');
const auth = require('../middleware/auth');
const multerPost = require('../middleware/multer-post');
const postCtrl = require('../controllers/post');

// Création du routeur Express

const router = express.Router();

// Création des routes

router.get('/', auth, postCtrl.getAllPosts);
router.get('/myposts', auth, postCtrl.getMyPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/', auth, multerPost, postCtrl.createPost);
router.put('/:id', auth, multerPost, postCtrl.updatePost);
router.delete('/:id', auth, postCtrl.deletePost);

// Exports

module.exports = router;