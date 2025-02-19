const Customer = require("../models/CustomerModel");
const jwt = require("jsonwebtoken");

const CreateWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKENCODE, { expiresIn: "3d" });
};

// Update Profile
const updateProfile = async (req, res) => {
  const { newContactNumber, newPassword } = req.body;
  const { token } = req.headers;

  try {
    // Verify the token and get user ID
    const decoded = jwt.verify(token, process.env.TOKENCODE);
    const customer = await Customer.findById(decoded._id);
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Update contact number if provided
    if (newContactNumber) {
      customer.contactNumber = newContactNumber;
    }

    // Update password if provided
    if (newPassword) {
      customer.password = newPassword; // Make sure to hash the password in the model
    }

    await customer.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { updateProfile };
