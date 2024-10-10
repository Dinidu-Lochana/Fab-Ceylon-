const Food = require('../models/FoodModel');
const mongoose = require('mongoose');


const createFood = async (req,res) => {
    const { foodName , price , description , foodCategory, isDeliveryAvailable, adminRef } = req.body;

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
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }
    try{
        const food = await Food.create({foodName,price,description,foodCategory,isDeliveryAvailable,adminRef})
        res.status(200).json(food)
        res.json({msgg:'Post the Food'})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}


module.exports = {
    createFood,
}