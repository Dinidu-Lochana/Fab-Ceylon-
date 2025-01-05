const Order = require('../models/FoodOrderModel');
const mongoose = require('mongoose'); // For ObjectId comparison



const getOrders = async (req, res) => {

  const {userId} = req.params;
  
  try {
      const orders = await Order.find({ userId : userId }).sort({ createdAt: -1 });
      res.status(200).json(orders);
  } catch (error) {
      return res.status(401).json({ error: "Error in loading foods" });
  }
};


// Import the Order model

// Controller to submit a rating for a specific food item
const submitRating = async (req, res) => {
  const { userId, foodId } = req.params; // Get the userId and foodId from URL
  const { rating } = req.body; // Get the rating from the body

  // Validate the rating (between 1 and 5)
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  try {
    // Find the order with the given foodId and userId
    const order = await Order.findOne({ "items.foodId": foodId, userId: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order or Food item not found.' });
    }

    // Find the specific food item in the order
    const foodItem = order.items.find(item => item.foodId.toString() === foodId);

    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found in the order.' });
    }

    // Check if the user has already rated this food item
    const existingRating = foodItem.ratings.find(rating => rating.userId.toString() === userId);

    if (existingRating) {
      // If the rating exists, update it
      existingRating.rating = rating;
    } else {
      // If no rating exists, add a new rating
      foodItem.ratings.push({ userId, rating });
    }

    // Recalculate the average rating for the food item
    const totalRatings = foodItem.ratings.length;
    const sumRatings = foodItem.ratings.reduce((sum, r) => sum + r.rating, 0);
    foodItem.averageRating = sumRatings / totalRatings;

    // Save the updated order
    await order.save();

    res.status(200).json({ message: 'Rating submitted successfully!', averageRating: foodItem.averageRating });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



const getRating = async (req, res) => {
  const { _id, foodId } = req.params;

  try {
    // Find the specific order
    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Ensure the items array exists and is not empty
    if (!Array.isArray(order.items) || order.items.length === 0) {
      return res.status(404).json({ message: 'No items found in this order.' });
    }

    // Find the specific food item in the items array
    const food = order.items.find(item => item.foodId.toString() === foodId);

    if (!food) {
      return res.status(404).json({ message: 'Food item not found in the order.' });
    }

    // Send the current average rating of the food item
    res.status(200).json({ rating: food.averageRating || 0 }); // Default to 0 if no rating is set
  } catch (error) {
    console.error('Error fetching rating:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getRating, getOrders,  submitRating };
