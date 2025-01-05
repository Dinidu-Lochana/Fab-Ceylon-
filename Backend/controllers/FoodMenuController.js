const Food = require('../models/FoodModel');
const Order=require('../models/FoodOrderModel')
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const getFoodsWithRatings = async (req, res) => {
    const { admin_id } = req.params; // Admin ID to filter foods by admin

    try {
        // Aggregation pipeline to calculate average ratings and fetch food details
        const foodsWithRatings = await Order.aggregate([
            { $unwind: "$items" }, // Decompose the items array
            { $unwind: "$items.ratings" }, // Flatten the ratings in each item
            {
                $group: {
                    _id: "$items.foodId", // Group by foodId
                    averageRating: { $avg: "$items.ratings.rating" }, // Calculate average rating for each food
                },
            },
            {
                $lookup: {
                    from: "foods", // Reference the Food collection
                    localField: "_id", // foodId from Order
                    foreignField: "_id", // foodId in Food collection
                    as: "foodDetails", // Include food details
                },
            },
            { $unwind: "$foodDetails" }, // Flatten the foodDetails array
            {
                $match: { "foodDetails.admin_id": mongoose.Types.ObjectId(admin_id) }, // Match by admin_id
            },
            {
                $project: {
                    _id: 1,
                    averageRating: { $round: ["$averageRating", 1] }, // Round averageRating to 1 decimal
                    "foodDetails.name": 1,
                    "foodDetails.price": 1,
                    "foodDetails.description": 1,
                    "foodDetails.isDeliveryAvailable": 1, // Include delivery availability
                },
            },
        ]);

        res.status(200).json(foodsWithRatings); // Return the aggregated results
    } catch (error) {
        console.error("Error fetching foods with ratings:", error);
        res.status(500).json({ error: "Error fetching foods with ratings." });
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

module.exports = {  getFoodsByType, getFoodsWithRatings };