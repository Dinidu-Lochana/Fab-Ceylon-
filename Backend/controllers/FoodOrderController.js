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
    const { foodCategory } = req.params;

    try {
        const foods = await Food.find({ foodCategory : foodCategory }).sort({ createdAt: -1 });
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
        // Extract data from the request body
        const { admin_id, userId, items, orderType, paymentMethod, orderDescription } = req.body;
    

        // Validate required fields
        if (!admin_id || !userId || !items || !orderType || !paymentMethod) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Ensure items array is valid and calculate totalAmount
        let totalAmount = 0;

        for (const item of items) {
            const { foodId, quantity, price, ratings } = item;
            

            if (!foodId || !quantity || !price) {
                return res.status(400).json({ message: "Invalid item details." });
            }

            if (quantity < 1 || price < 0) {
                return res.status(400).json({ message: "Quantity and price must be valid numbers." });
            }

            // Find the food item
            const food = await Food.findById(foodId);
            if (!food) {
                return res.status(404).json({ message: `Food item with ID ${foodId} not found.` });
            }

            // Update rating logic if ratings are provided
            if (ratings && ratings.length > 0) {
                for (const { userId: ratingUserId, rating } of ratings) {
                    if (rating >= 1 && rating <= 5) { // Validate rating is between 1 and 5
                        const newTotalRatings = food.totalRatings + 1;
                        const newAverageRating =
                            (food.averageRating * food.totalRatings + rating) / newTotalRatings;

                        // Update the food document in the database
                        await Food.findByIdAndUpdate(
                            food._id,
                            {
                                $set: {
                                    averageRating: newAverageRating,
                                    totalRatings: newTotalRatings,
                                },
                            },
                            { new: true }
                        );
                    }
                }
            }

            // Calculate total amount for the order
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

        // Save the order
        const savedOrder = await newOrder.save();

        // Respond with the saved order
        res.status(200).json({ message: "Order created successfully", order: savedOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};





const getOrders = async (req, res) => {
    const { userId, admin_id } = req.params;

    try {
        // Find orders matching both userId and adminId
        const orders = await Order.find({ userId: userId, admin_id: admin_id });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "Error in loading orders" });
    }
};



module.exports = { getFoods , getFoodsByType , getFoodsDeliveryAvailable , orderFoods, getOrders, };