// Imports

const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

// Création du routeur Express

const router = express.Router();

// Création des routes

router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);
router.get('/:id', auth, userCtrl.getUser);
router.put('/:id/password', auth, userCtrl.updatePwdUser);
router.delete('/:id', auth, userCtrl.deleteUser);
router.put('/:id', auth, multer, userCtrl.updateUser);

// Exports

module.exports = router;