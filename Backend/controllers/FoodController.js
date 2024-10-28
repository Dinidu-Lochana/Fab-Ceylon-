const Food = require('../models/FoodModel');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


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
    const admin_id = req.admin._id;  
    try {
        const foods = await Food.find({ admin_id }).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createFood,
    upload,
    getFoods,
}