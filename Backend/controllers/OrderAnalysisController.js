
const Order = require('../models/FoodOrderModel');

const getOrderCountByAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;  // Admin ID from URL params
        const { startDate, endDate } = req.body;  // Date range from request body

        // Ensure that admin_id is provided
        if (!admin_id) {
            return res.status(400).json({ message: "Admin ID is required." });
        }

        // Ensure startDate and endDate are provided in request body
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required." });
        }

        // Convert the start and end dates from strings to JavaScript Date objects
        let start = new Date(startDate);
        let end = new Date(endDate);

        // Normalize the start date to the beginning of the day (00:00:00)
        start.setHours(0, 0, 0, 0);

        // Normalize the end date to the end of the day (23:59:59)
        end.setHours(23, 59, 59, 999);

        // Ensure that the start date is before the end date
        if (start > end) {
            return res.status(400).json({ message: "Start date must be before end date." });
        }

        // Find and count the orders for the admin_id within the specified date range
        const orderCount = await Order.countDocuments({
            admin_id,
            createdAt: { $gte: start, $lte: end }  // Filter orders by date range
        });

        // Respond with the count of orders for the admin_id within the date range
        res.status(200).json({ admin_id, orderCount });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getOrderCountByAdminAndFood = async (req, res) => {
    try {
        // Extract admin_id from URL params
        const { admin_id } = req.params;

        // Extract foodId, startDate, and endDate from the request body
        const { foodId, startDate, endDate } = req.body;

        // Count the number of orders for the given admin_id, foodId, and date range
        const orderCount = await Order.countDocuments({
            admin_id,
            'items.foodId': foodId, // Match the foodId in the items array
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } // Filter orders by date range
        });

        // Respond with the count of orders for the admin_id and foodId within the date range
        res.status(200).json({ admin_id, foodId, orderCount });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




module.exports = {getOrderCountByAdmin, getOrderCountByAdminAndFood };