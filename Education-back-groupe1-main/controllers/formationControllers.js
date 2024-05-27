const formationModel= require('../models/formation');

exports.ajouterFormation = async(req,res)=> {
    try{
        const formationObj = {
            titre : req.body.titre,
            description : req.body.description,
            contenu: req.body.contenu,
            temps:req.body.temps
        }; 

        const Formation = new formationModel(formationObj);

        await Formation.save()
        res.status(200).json(Formation)

    } catch(error){
        return res.status(400).json({error: error.message})
    }
};

exports.listerFormation = async (req, res) => {
    try {
      const Formation = await formationModel.find({}).exec();
      return res.status(200).json({ Formation });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  
exports.modifierFormation = async (req, res) => {
    try {
        const formationId = req.params.formationId;
        const updatedFormationObj = {
            titre : req.body.titre,
            description : req.body.description,
            contenu: req.body.contenu
        };
    
        const updatedFormation = await formationModel.findByIdAndUpdate(
          formationId,
          updatedFormationObj,
          { new: true }
        );
    
        if (!updatedFormation) {
          return res.status(404).json({ error: "Formation not found" });
        }
    
        return res.status(200).json({ updatedFormation });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    };
    
  exports.supprimerFormation = async (req, res) => {
      try {
        const formationId = req.params.formationId;
    
        const deletedFormation = await formationModel.findByIdAndDelete(formationId);
    
        if (!deletedFormation) {
          return res.status(404).json({ error: "Formation not found" });
        }
    
        return res.status(200).json({ deletedFormation });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
  };