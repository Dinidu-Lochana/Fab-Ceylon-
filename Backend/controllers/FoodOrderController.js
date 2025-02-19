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
        
        const { 
            admin_id, userId, items, orderType, 
            paymentMethod, orderDescription, senderDetails, receiverDetails 
        } = req.body;

   
        if (!admin_id || !userId || !items || !orderType || !paymentMethod || !senderDetails) {
            return res.status(400).json({ message: "Missing required fields." });
        }
      
        if (!senderDetails.name || !senderDetails.contactNumber) {
            return res.status(400).json({ message: "Sender name and contact number are required." });
        }

       
        if (orderType === "Delivery") {
            if (!receiverDetails || !receiverDetails.name || !receiverDetails.contactNumber || !receiverDetails.address) {
                return res.status(400).json({ message: "Receiver details (name, contact number, address) are required for delivery." });
            }
        }

        
        let totalAmount = 0;
        for (const item of items) {
            const { foodId, foodName, quantity, price } = item;

            if (!foodId || !quantity || !price || !foodName) {
                return res.status(400).json({ message: "Invalid item details." });
            }

            if (quantity < 1 || price < 0) {
                return res.status(400).json({ message: "Quantity and price must be valid numbers." });
            }

            
            const foodExists = await Food.findById(foodId);
            if (!foodExists) {
                return res.status(404).json({ message: `Food item with ID ${foodId} not found.` });
            }

            
            totalAmount += quantity * price;
        }

       
        const newOrder = new Order({
            admin_id,
            userId,
            items,
            orderType,
            paymentMethod,
            totalAmount,
            orderDescription,
            senderDetails,
            receiverDetails: orderType === "Delivery" ? receiverDetails : null, // Only if Delivery
        });

  
        const newFoodOrder = await Order.create(newOrder);

       
        res.status(200).json({ message: 'Order created successfully'});

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = { getFoods , getFoodsByType , getFoodsDeliveryAvailable , orderFoods};