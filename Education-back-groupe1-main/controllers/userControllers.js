//const user = require('../models/user');
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

exports.ajouterUser = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      numInscri_eleve,
      matiere,
      telephone,
      email,
      password,
      role,
      eleve_class,
      niveau,
      date_de_naissance,
      photo,
    } = req.body;

    if (photo) {
      photo = getBase64Image(userObj.photo);
    }

    //parent role
    if (
      numInscri_eleve &&
      Array.isArray(numInscri_eleve) &&
      numInscri_eleve.length > 0
    ) {
      const parentPayload = {
        nom,
        prenom,
        telephone,
        email,
        password,
        role: "parent",
        date_de_naissance,
        photo,
      };

      //create parent user
      const parentUser = new userModel(parentPayload);
      await parentUser.save();

      //link parent to student using numInscri_eleve
      for (const numInscri of numInscri_eleve) {
        const student = await userModel.findOne({ numInscri });
        if (!student) {
          return res
            .status(400)
            .json({ error: `Student not found with numInscri: ${numInscri}` });
        }
        student.parent = parentUser._id; // link parent to student
        await student.save();
      }

      return res.status(200).json({
        message: "Parent created and linked to student(s).",
      });
    } else if (role == "enseignant") {
      // enseignant registration process
      const enseignantPayload = {
        nom,
        prenom,
        telephone,
        email,
        password,
        date_de_naissance,
        photo,
      };
      const enseignantUser = new userModel(enseignantPayload);
      await enseignantUser.save();

      return res.status(200).json({ message: "Enseignant created." });
    } else {
      // student registration process
      const studentPayload = {
        nom,
        prenom,
        matiere,
        telephone,
        email,
        password,
        eleve_class,
        niveau,
        date_de_naissance,
        photo,
      };
      const studentUser = new userModel(studentPayload);
      await studentUser.save();

      return res.status(200).json({ message: "Student created." });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Find the user in the database
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    // Generate a signed JWT token
    const token = jwt.sign(
      { userId: user._id, exp: expirationTime },
      process.env.TOKEN_SECRET
    );

    res
      .header("Authorization", `Bearer ${token}`)
      .send({ token: token, expiresIn: expirationTime, message: "sucess" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "token not found" });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ error: "invalid token" });
    }

    const userId = decodedToken.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    user.photo = `${process.env.BASE_URL}/uploads/${user.photo}`;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "failed to get Current User" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({ error: "logout successfully" });
  } catch (error) {
    res.status(500).json({ error: "logout failed" });
  }
};

exports.listerUser = async (req, res) => {
  try {
    const User = await userModel.find({}).exec();
    return res.status(200).json({ User });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    user.photo = `${process.env.BASE_URL}/uploads/${user.photo}`;

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.modifierUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const oldPhoto = user.photo;

    const updatedUserObj = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      numInscri: req.body.numInscri,
      matiere: req.body.matiere,
      telephone: req.body.telephone,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      parent: req.body.parent,
      niveau: req.body.niveau,
      date_de_naissance: req.body.date_de_naissance,
      eleve_class: req.body.eleve_class,
      photo: req.body.photo,
    };
    if (oldPhoto) {
      const oldPhotoPath = path.join("uploads", oldPhoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    if (updatedUserObj.photo && !updatedUserObj.photo.startsWith("http")) {
      const photoName = getBase64Image(updatedUserObj.photo);
      updatedUserObj.photo = photoName;
      if (oldPhoto) {
        const oldPhotoPath = path.join("uploads", oldPhoto);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }
    const baseUrl = `${process.env.BASE_URL}/uploads/`;

    // Utiliser replace avec une expression régulière pour éliminer la partie de l'URL
    updatedUserObj.photo = updatedUserObj.photo.replace(
      new RegExp(baseUrl, "i"),
      ""
    );
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updatedUserObj,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ updatedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.supprimerUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const oldPhoto = user.photo;
    if (oldPhoto) {
      const oldPhotoPath = path.join("uploads", oldPhoto);
      if (fs.existsSync(oldPhotoPath)) {
        // inlink tfs5
        fs.unlinkSync(oldPhotoPath);
      }
    }
    const deletedUser = await userModel.findByIdAndDelete(userId);

    return res.status(200).json({ deletedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.listerEnseignant = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: "enseignant" })
      .populate("matiere")
      .exec();
    const modifiedUsers = users.map((user) => {
      return {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        matiere: user.matiere,
        email: user.email,
        telephone: user.telephone,
        photo: `${process.env.BASE_URL}/uploads/${user.photo}`,
        role: user.role,
      };
    });
    return res.status(200).json(modifiedUsers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.listerParent = async (req, res) => {
  try {
    const users = await userModel.find({ role: "parent" }).exec();
    const modifiedUsers = users.map((user) => {
      return {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        email: user.email,
        photo: `${process.env.BASE_URL}/uploads/${user.photo}`,
        role: user.role,
      };
    });
    return res.status(200).json(modifiedUsers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.listerEleve = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: "eleve" })
      .populate("parent")
      .exec();
    const modifiedUsers = users.map((user) => {
      return {
        _id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        niveau: user.niveau,
        parent: user.parent,
        date_de_naissance: user.date_de_naissance,
        photo: `${process.env.BASE_URL}/uploads/${user.photo}`,
        role: user.role,
      };
    });
    return res.status(200).json(modifiedUsers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
function getBase64Image(base64String) {
  const matches = base64String.match(/^data:(image\/([a-zA-Z]+));base64,/);
  if (!matches) {
    throw new Error("Invalid base64 string: no image data found");
  }
  const extension = matches[2];
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

  const buffer = Buffer.from(base64Data, "base64");
  const photoName = `${Date.now()}.${extension}`; // Modify the path as per your requirement
  const photoPath = `uploads/${photoName}`; // Modify the path as per your requirement

  fs.writeFileSync(photoPath, buffer);

  return photoName;
}
