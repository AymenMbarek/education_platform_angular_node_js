const express = require('express');
const router = express.Router();
const UserControllers  = require('../controllers/userControllers');

router.post("/ajouter", UserControllers.ajouterUser);
router.post("/modifier/:userId", UserControllers.modifierUser);
router.get("/getUser/:userId", UserControllers.getUser);

router.post("/supprimer/:userId", UserControllers.supprimerUser);
router.post("/login", UserControllers.loginUser);
router.get("/lister", UserControllers.listerUser);
router.get("/listEnseignants", UserControllers.listerEnseignant);
router.get("/listEleve", UserControllers.listerEleve);
module.exports = router ;