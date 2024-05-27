const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numInscri: { type: Number },
  matiere: { type: String },
  telephone: { type: Number },
  email: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ["admin", "parent", "enseignant", "eleve"],
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  date_de_naissance: { type: Date },
  class: { type: String },
  niveau: { type: Number },
});

module.exports = mongoose.model("User", userSchema);
