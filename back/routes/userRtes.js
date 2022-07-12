const router = require("express").Router();
const ctrl = require("../controllers/userCtrl");

router.post("/", ctrl.addUser);         //Création du user
router.post("/login", ctrl.login);
router.delete("/:id", ctrl.deleteUser); //Supprimer un user

module.exports=router;