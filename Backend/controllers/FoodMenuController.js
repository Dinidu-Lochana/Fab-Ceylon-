const Food = require('../models/FoodModel');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const getFoods = async (req, res) => {

    const {admin_id} = req.params;
    
    try {
        const foods = await Food.find({ admin_id : admin_id }).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        return res.status(401).json({ error: "Error in loading foods" });
    }
};

const getFoodsByType = async (req , res) => {
    const { foodCategory } = req.params;

    try {
        const foods = await Food.find({ foodCategory : foodCategory }).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        return res.status(401).json({ error: "Error in loading foods" });
    }
};

module.exports = { getFoods , getFoodsByType };