const mongoose = require("mongoose")
const coursSchema = new mongoose.Schema({

titre: {type: String, required: true},
description: {type: String, required: true},
contenu: {type: String, required: true}

});
module.exports = mongoose.model("Cours", coursSchema);