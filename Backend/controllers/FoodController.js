const Food = require('../models/FoodModel');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')       // file storing path
    },

    filename: (req , file, cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const createFood = async (req,res) => {
    
    const {admin_id, foodName , price , description , foodCategory, isDeliveryAvailable } = req.body;

    let emptyFields = []

    if(!foodName){
        emptyFields.push['foodName'];
    }
    if(!price){
        emptyFields.push['price'];
    }
    if(!description){
        emptyFields.push['description'];
    }
    if(!foodCategory){
        emptyFields.push['foodCategory'];
    }
    if(!isDeliveryAvailable){
        emptyFields.push['isDeliveryAvailable'];
    }
    if (!req.file) {
        emptyFields.push('image');
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }
    try {

        const imagePath = req.file.path;

        const foodData = {
            admin_id,
            foodName,
            price,
            description,
            foodCategory,
            isDeliveryAvailable,
            image: imagePath
        };

        const food = await Food.create(foodData);
        res.status(200).json({ message: 'Food created successfully', food });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFoods = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized access. Token not provided or invalid format." });
    }

    const token = authHeader.split(" ")[1]; 
    
    try {
        
        const tokenObject = JSON.parse(token);

        const createdToken = tokenObject.createdToken;

        const decodedToken = jwt.decode(createdToken);
        const adminId = decodedToken._id; 

        const foods = await Food.find({ admin_id : adminId }).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        
        return res.status(401).json({ token,error: "Unauthorized access. Invalid or expired token." });
    }
};

const updateFood = async (req, res) => {
    console.log("Update Food Function Called");

    const { id } = req.params;
    console.log("Received ID:", id);

    const { foodName, price, description, foodCategory, isDeliveryAvailable } = req.body;

    let emptyFields = [];

    if (!foodName) {
        emptyFields.push('foodName');
    }
    if (!price) {
        emptyFields.push('price');
    }
    if (!description) {
        emptyFields.push('description');
    }
    if (!foodCategory) {
        emptyFields.push('foodCategory');
    }
    if (!isDeliveryAvailable) {
        emptyFields.push('isDeliveryAvailable');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    try {
        // Use req.file if an image file is uploaded
        let updatedData = { foodName, price, description, foodCategory, isDeliveryAvailable };

        if (req.file) {
            updatedData.image = req.file.path;  // Save the new image path if provided
        }

        const updatedFood = await Food.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedFood) {
            return res.status(404).json({ error: 'Food not found' });
        }

        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const deleteFood = async (req, res) => {
    const { id } = req.params;
    console.log("Delete Food Function Called with ID:", id); 

    try {
        
        const deletedFood = await Food.findByIdAndDelete(id);
        
       
        if (!deletedFood) {
            console.log("Food not found with ID:", id); 
            return res.status(404).json({ error: 'Food not found' });
        }

     
        res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
       
        console.error("Error deleting food:", error.message);
        
        res.status(400).json({ error: error.message });
    }
};




module.exports = {
    createFood,
    upload,
    getFoods,
    updateFood,
    deleteFood
}