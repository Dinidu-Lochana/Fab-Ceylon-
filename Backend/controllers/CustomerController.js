const Customer = require("../models/CustomerModel");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const otpGenerator = require('otp-generator');

const CreateWebToken = (_id) => {
  return jwt.sign({ _id }, process.env.TOKENCODE, { expiresIn: "3d" });
};

const login = async (req, res) => {
    
  const { contactNumber, password } = req.body;
  
  try {
    const detectedCustomer = await Customer.login(contactNumber, password);
    const createdToken = CreateWebToken(detectedCustomer._id);
    res.status(200).json({ contactNumber, createdToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const startOTPVerification = async (req,res) =>{
  const { name,contactNumber, password } = req.body;
  try {
    const generatedOTP = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const response = await axios.get(
      `https://app.text.lk/api/http/sms/send?recipient=${contactNumber}&sender_id=TextLKDemo&message=OTP:${generatedOTP}&api_token=437|BS4iSYLhdKmXURkWErcuQL7YSnpyZrN0oJfzjE4i23abde16`
    );
    
  console.log(response)
   if(response.statusText == 'OK' && response.data.message == "Your message was successfully delivered"){
    res.status(200).json({ message:"OTP code sent successfully", generatedOTP})
  }else{
    throw Error("Phone number is incorrect or not Sri Lankan")
  }                  
  
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

}

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

module.exports = { login, signup,startOTPVerification };