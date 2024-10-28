const Customer = require("../models/CustomerModel");
const jwt = require("jsonwebtoken");

const CreateWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKENCODE, { expiresIn: "3d" });
};

const login = async (req, res) => {
    console.log(req.body)
  const { contactNumber, password } = req.body;
  console.log(contactNumber)
  try {
    const detectedCustomer = await Customer.login(contactNumber, password);
    const createdToken = CreateWebToken(detectedCustomer._id);
    res.status(200).json({ contactNumber, createdToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  const { name,contactNumber, password } = req.body;
  try {
    const createdCustomer = await Customer.signup(name,contactNumber, password);
    const createdToken = CreateWebToken(createdCustomer._id);
    res.status(200).json({ contactNumber, createdToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { login, signup };