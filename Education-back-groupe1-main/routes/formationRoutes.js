const express = require('express');
const router = express.Router();
const FormationControllers  = require('../controllers/formationControllers');

router.post("/ajouter", FormationControllers.ajouterFormation);
router.post("/modifier/:formationId", FormationControllers.modifierFormation);
router.post("/supprimer/:formationId", FormationControllers.supprimerFormation);
router.get("/lister", FormationControllers.listerFormation);

module.exports = router ;