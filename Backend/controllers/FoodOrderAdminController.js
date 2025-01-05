const Order = require('../models/FoodOrderModel');
const Food = require('../models/FoodModel');
const Customer = require('../models/CustomerModel')

const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const getOrders = async (req, res) => {
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

        // Fetch orders for the admin
        const foodOrders = await Order.find({ admin_id: adminId }).sort({ createdAt: -1 });

        // Enrich orders with food names and customer names
        const enrichedOrders = await Promise.all(
            foodOrders.map(async (order) => {
                const customer = await Customer.findById(order.userId);
                const itemsWithFoodDetails = await Promise.all(
                    order.items.map(async (item) => {
                        const food = await Food.findById(item.foodId);
                        return {
                            ...item.toObject(),
                            foodName: food ? food.name : "Unknown Food"
                        };
                    })
                );

                return {
                    ...order.toObject(),
                    customerName: customer ? customer.name : "Unknown Customer",
                    items: itemsWithFoodDetails
                };
            })
        );

        res.status(200).json(enrichedOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ error: "An error occurred while fetching orders." });
    }
};

const updateOrder = async (req, res) => {
    console.log("Update Food Function Called");

    const { id } = req.params;
    console.log("Received ID:", id);

    const { status, paymentStatus } = req.body;

    let emptyFields = [];

    if (!status) {
        emptyFields.push('status');
    }
    if (!paymentStatus) {
        emptyFields.push('paymentStatus');
    }
    
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    try {
       
        let updatedData = { status, paymentStatus };

        
        const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    console.log("Delete Order Function Called with ID:", id); 

    try {
        
        const deletedOrder = await Order.findByIdAndDelete(id);
        
       
        if (!deletedOrder) {
            console.log("Order not found with ID:", id); 
            return res.status(404).json({ error: 'Order not found' });
        }

     
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
       
        console.error("Error deleting Order:", error.message);
        
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getOrders,
    updateOrder,
    deleteOrder
}