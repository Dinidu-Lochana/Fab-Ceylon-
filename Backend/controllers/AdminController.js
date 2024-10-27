const Admin = require("../models/AdminModel");
const jwt = require("jsonwebtoken");

const CreateWebToken = (_id) => {
    return jwt.sign({_id}, process.env.TOKENCODE, {expiresIn: "3d"});
};

const adminLogin = async (req , res) => {
    console.log(req.body)
    const {cafeName, password} = req.body;
    console.log(cafeName);
    try{
        const detectedAdmin = await Admin.adminLogin(cafeName,password);
        const createdToken = CreateWebToken(detectedAdmin._id);
        res.status(200).json({cafeName , createdToken});
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
};

const adminSignup = async (req, res) => {
    const {cafeName,contactNumber,password} = req.body;
    try{
        const createdAdmin = await Admin.adminSignup(cafeName,contactNumber,password);
        const createdToken = CreateWebToken(createdAdmin._id);
        res.status(200).json({cafeName,createdToken});
    }
    catch (err) {
        res.status(400).json({error:err.message});
    }
};

module.exports={adminLogin,adminSignup};