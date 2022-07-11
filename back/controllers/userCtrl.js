const model = require("../models/modelUsers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function addUser(req, res) {
  const user = req.body;
  try {
    user.password = await bcrypt.hash(user.password, 10);
    model.add(user);
    res.status(200).json({ message: "utilisateur ajouté" });
  } catch (e) {
    console.error("error:", e);
    res.status(500).json({ message: "echec", error: e });
  }
}

async function login(req, res) {
  const user = req.body;
  try {
    const userFromDatabase = model.getByEmail(user.email);
    if (userFromDatabase.password === undefined)
      throw { status: 401, message: "le compte n'existe pas" };
    const isValidPwd = await bcrypt.compare(
      user.password,
      userFromDatabase.password
    );
    if (!isValidPwd) throw { status: 401, message: "mot de passe non valide" };
    const token = jwt.sign(
      { userId: userFromDatabase.id },
      // @ts-ignore
      process.env["JWT_SECRET"],
      {
        expiresIn: "24h",
      }
    );
    delete userFromDatabase.password;
    res.status(201).json({ message: "bienvenue", token, ...userFromDatabase });
  } catch (e) {
    console.error("error:", e);
    res.status(e.status || 500).json({ error: e });
  }
}

async function deleteUser(req, res) {
  const { email } = req.body;
  try {
    await model.deleteUser(email)
    return res.status(200).send();
  } catch (err) {
    return res.status(500).send();
  }

}

module.exports = {
  addUser,
  deleteUser,
  login,
};
