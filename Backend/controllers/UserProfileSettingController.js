const Customer = require("../models/CustomerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const CreateWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKENCODE, { expiresIn: "3d" });
};



// Update Profile
const updateProfile = async (req, res) => {
  const { newContactNumber, newPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Extract only the token part

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKENCODE);
    const customer = await Customer.findById(decoded._id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Update contact number if provided
    if (newContactNumber) {
      customer.contactNumber = newContactNumber;
    }

    // Hash new password before saving
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      customer.password = await bcrypt.hash(newPassword, salt);
    }

    await customer.save();
    res.status(200).json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { updateProfile };
