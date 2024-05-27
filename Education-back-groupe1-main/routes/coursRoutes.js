const express = require('express');
const router = express.Router();
const CoursControllers  = require('../controllers/coursControllers');

router.post("/ajouter", CoursControllers.ajouterCours);
router.post("/modifier/:coursId", CoursControllers.modifierCours);
router.post("/supprimer/:coursId", CoursControllers.supprimerCours);
router.get("/listCours", CoursControllers.listerCours);

module.exports = router ;