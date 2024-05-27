const mongoose = require("mongoose")
const formationSchema = new mongoose.Schema({

titre: {type: String, required: true},
description: {type: String, required: true},
contenu: {type: String, required: true},
temps: {type: String, required: true}
});
module.exports = mongoose.model("Formation", formationSchema);