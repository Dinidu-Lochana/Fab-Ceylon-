const Food = require('../models/FoodModel');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const Order = require('../models/FoodOrderModel')

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
    const { admin_id,foodCategory } = req.params;
    

    try {
        const foods = await Food.find({ admin_id : admin_id , foodCategory : foodCategory , isDeliveryAvailable : true}).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        return res.status(401).json({ error: "Error in loading foods" });
    }
};

const getFoodsDeliveryAvailable = async (req,res) => {
    
    try {
        const foods = await Food.find({ isDeliveryAvailable : true }).sort({ createdAt: -1 });
        res.status(200).json(foods);
    } catch (error) {
        return res.status(401).json({ error: "Error in loading foods" });
    }
}

const orderFoods = async (req, res) => {
    try {
        // Extract data from request body
        const { admin_id, userId, items, orderType, paymentMethod, orderDescription } = req.body;

        // Validate required fields
        if (!admin_id || !userId || !items || !orderType || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Ensure items array is valid and calculate totalAmount
        let totalAmount = 0;
        for (const item of items) {
            const { foodId, foodName, quantity, price ,  } = item;

            if (!foodId || !quantity || !price || !foodName) {
                return res.status(400).json({ message: "Invalid item details." });
            }

            if (quantity < 1 || price < 0) {
                return res.status(400).json({ message: "Quantity and price must be valid numbers." });
            }

            // Optional: Validate foodId exists in the database
            const foodExists = await Food.findById(foodId);
            if (!foodExists) {
                return res.status(404).json({ message: `Food item with ID ${foodId} not found.` });
            }

            // Calculate total amount
            totalAmount += quantity * price;
        }

        // Create a new order
        const newOrder = new Order({
            admin_id,
            userId,
            items,
            orderType,
            paymentMethod,
            totalAmount,
            orderDescription,
        });

        
        

        const newFoodOrder = await Order.create(newOrder) 
        // Respond with the saved order
        res.status(200).json({ message: 'Order created successfully', newFoodOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { getFoods , getFoodsByType , getFoodsDeliveryAvailable , orderFoods};