const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const coursRoutes = require("./routes/coursRoutes");
app.use("/cours", coursRoutes);

const formationRoutes = require("./routes/formationRoutes");
app.use("/formation", formationRoutes);

mongoose.connect(process.env.BD_connect, {
  useNewUrlParser: true,
});

const bd = mongoose.connection;
bd.once("open", () => {
  console.log("Database connected !");
});

bd.once("error", (err) => {
  console.log("connection error !", err);
});

app.listen(3000, () => {
  console.log("Serveur Demarrer");
});
