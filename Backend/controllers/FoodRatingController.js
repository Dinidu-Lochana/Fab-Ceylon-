const Order = require('../models/FoodOrderModel');
const Food = require('../models/FoodModel');
const mongoose = require('mongoose'); // For ObjectId comparison





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

const submitFoodRating = async (req, res) => {
    const { _id, items } = req.body; // orderId and items containing foodId and ratings
    try {
        // Validate that 'items' is an array and contains data
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: "Invalid input: 'items' is required and must be an array with at least one item."
            });
        }

        // Find the existing order by orderId
        const order = await Order.findById(_id);
        if (!order) {
            return res.status(404).json({
                error: `Order with ID ${_id} not found.`
            });
        }

        // Iterate over each item in the items array
        for (const { foodId, ratings } of items) {
            console.log("Debug - Received Item:", { foodId, ratings });

            // Validate that each item has a valid foodId and ratings array
            if (!foodId || !ratings || !Array.isArray(ratings)) {
                return res.status(400).json({
                    error: "Invalid input: each item must have a foodId and ratings array."
                });
            }

            // Find the food item in the database
            const food = await Food.findById(foodId);
            if (!food) {
                return res.status(404).json({
                    error: `Food item with ID ${foodId} not found.`
                });
            }

            // Update ratings for the specific food in the order
            for (const { userId: ratingUserId, rating } of ratings) {
                if (rating < 1 || rating > 5) {
                    return res.status(400).json({
                        error: "Invalid rating value. Rating must be between 1 and 5."
                    });
                }

                // Find the index of the item in the order's items array
                const orderItemIndex = order.items.findIndex(item => item.foodId.toString() === foodId.toString());
                if (orderItemIndex !== -1) {
                    const existingRatingIndex = order.items[orderItemIndex].ratings.findIndex(rating => rating.userId.toString() === ratingUserId.toString());

                    if (existingRatingIndex !== -1) {
                        // Update the existing rating for the user
                        order.items[orderItemIndex].ratings[existingRatingIndex].rating = rating;
                    } else {
                        // Add a new rating if it doesn't exist
                        order.items[orderItemIndex].ratings.push({ userId: ratingUserId, rating });
                    }
                }
            }

            // Recalculate the food's average rating after the new rating
            const newTotalRatings = food.totalRatings + ratings.length;
            const newAverageRating =
                (food.averageRating * food.totalRatings + ratings.reduce((sum, r) => sum + r.rating, 0)) / newTotalRatings;

            // Update the food's average rating in the database
            await Food.findByIdAndUpdate(
                foodId,
                {
                    averageRating: newAverageRating,
                    totalRatings: newTotalRatings
                },
                { new: true }
            );
        }

        // Save the updated order with new ratings
        await order.save();

        // Send a success response
        return res.status(200).json({
            message: "Ratings updated successfully."
        });

    } catch (error) {
        console.error("Error submitting rating:", error.message);

        // Send error response to the client
        return res.status(500).json({
            error: "An error occurred while updating the ratings.",
            details: error.message
        });
    }
};



module.exports = {  submitFoodRating ,getOrders };
