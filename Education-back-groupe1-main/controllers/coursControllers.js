const coursModel= require('../models/cours');

exports.ajouterCours = async(req,res)=> {
    try{
        const coursObj = {
            titre : req.body.titre,
            description : req.body.description,
            contenu: req.body.contenu
        }; 

        const Cours = new coursModel(coursObj);

        await Cours.save()
        res.status(200).json(Cours)

    } catch(error){
        return res.status(400).json({error: error.message})
    }
};

exports.listerCours = async (req, res) => {
    try {
      const Cours = await coursModel.find({}).exec();
      return res.status(200).json({ Cours });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  
exports.modifierCours = async (req, res) => {
    try {
        const coursId = req.params.coursId;
        const updatedCoursObj = {
            titre : req.body.titre,
            description : req.body.description,
            contenu: req.body.contenu
        };
    
        const updatedCours = await coursModel.findByIdAndUpdate(
          coursId,
          updatedCoursObj,
          { new: true }
        );
    
        if (!updatedCours) {
          return res.status(404).json({ error: "Cours not found" });
        }
    
        return res.status(200).json({ updatedCours });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    };
    
  exports.supprimerCours = async (req, res) => {
      try {
        const coursId = req.params.coursId;
    
        const deletedCours = await coursModel.findByIdAndDelete(coursId);
    
        if (!deletedCours) {
          return res.status(404).json({ error: "Cours not found" });
        }
    
        return res.status(200).json({ deletedCours });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
  };