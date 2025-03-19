const Order = require('../models/FoodOrderModel');
const Food = require('../models/FoodModel');

const getOrderCountByAdmin = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { startDate, endDate } = req.query;

        console.log('fdgdfg', admin_id);

        if (!admin_id || !startDate || !endDate) {
            return res.status(400).json({ message: "Admin ID, start date, and end date are required." });
        }

        const orderCount = await Order.countDocuments({

            admin_id,
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        res.status(200).json([{ name: "Orders", count: orderCount }]);
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getOrderCountOrderType = async(req, res) =>{
    try{
        const { admin_id}=req.params;
        const {startDate, endDate, orderType}=req.query;
        console.log('Type',orderType);
        console.log('Id', admin_id);

        if (!admin_id || !startDate || !endDate || !orderType){
             return res.status(400).json({message: "Admin ID, start date, end date and orderType are required."})
        }

        const orderCount=await Order.countDocuments({
            admin_id,
            orderType,
            createdAt: {$gte: new Date(startDate), $lte: new Date(endDate)}
        });
       res.status(200).json([{orderType, count: orderCount}]);
    }
    catch(error){
        res.status(500).json({message: "Internal server error"});
      
    }
};






const mongoose = require("mongoose");



const getOrderCountByAdminAndFoodName = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { foodName, startDate, endDate } = req.query;

        console.log('Admin ID:', admin_id);
        console.log('Food Name:', foodName);
        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);

        if (!admin_id || !foodName || !startDate || !endDate) {
            return res.status(400).json({ message: "Admin ID, food name, start date, and end date are required." });
        }

        // Convert start and end date to Date objects
        let start = new Date(startDate);
        let end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ message: "Start date must be before end date." });
        }

        // Find orders within the specified date range and admin_id
        const orders = await Order.find({
            admin_id,
            createdAt: { $gte: start, $lte: end }  // Filter by date range
        });

        let foodNameOrderCount = 0;

        // Iterate through orders and count those with the foodName in items
        for (let order of orders) {
            for (let item of order.items) {
                // Directly compare foodName from order items to the provided foodName
                if (item.foodName.toLowerCase() === foodName.toLowerCase()) {
                    foodNameOrderCount++;
                }
            }
        }

        console.log('dfgfdh',foodNameOrderCount );

        res.status(200).json([{ admin_id, foodName, count: foodNameOrderCount }]);
        
    } catch (error) {
        console.error("Error fetching order count by food name:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};





const getOrderCountByFoodCategory = async (req, res) => {
    try {
        const { admin_id } = req.params;  // Admin ID from URL params
        const { startDate, endDate, foodCategory } = req.query;  // Get from query parameters
        console.log('dsdhjfsdf',admin_id);
        console.log('dsfgdfg',foodCategory);
        console.log('WEW',startDate);
        console.log('ertrtr',endDate);

        console.log("Received GET request:", { admin_id, startDate, endDate, foodCategory });

        if (!admin_id || !foodCategory || !startDate || !endDate) {
            return res.status(400).json({ message: "Admin ID, food category, start date, and end date are required." });
        }

        // Convert dates from strings to Date objects
        let start = new Date(startDate);
        let end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ message: "Start date must be before end date." });
        }

        const orders = await Order.find({
            admin_id,
            createdAt: { $gte: start, $lte: end }  // Filter by date range
        });

        let foodCategoryOrderCount = 0;

        for (let order of orders) {
            for (let item of order.items) {
                const food = await Food.findById(item.foodId);
                if (food && food.foodCategory.toLowerCase() === foodCategory.toLowerCase()) {
                    foodCategoryOrderCount++; 
                }
            }
        }

        res.status(200).json([{ admin_id, foodCategory, count: foodCategoryOrderCount }]);
    } catch (error) {
        console.error("Error fetching order count by food category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



const getOrderCountByMonthRange = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { startYear, startMonth, endYear, endMonth } = req.query;

        console.log('sdfdsf', admin_id);
        console.log('sdfdsfg', startYear);
        console.log('sdfdsffd', startMonth);
        console.log('werwer', endYear);
        console.log('dsfsdf',endMonth);
    

        if (!admin_id || !startYear || !startMonth || !endYear || !endMonth) {
            return res.status(400).json({ message: "Admin ID, start year, start month, end year, and end month are required." });
        }

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const startDate = new Date(Date.UTC(parseInt(startYear), parseInt(startMonth) - 1, 1, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(parseInt(endYear), parseInt(endMonth), 0, 23, 59, 59, 999));

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const orders = await Order.aggregate([
            {
                $match: {
                    admin_id: new mongoose.Types.ObjectId(admin_id),  
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        console.log("Filtered Orders:", orders);

        if (orders.length === 0) {
            return res.status(200).json({ message: "No orders found in the given range." });
        }

        const response = orders.map(order => ({
            year: order._id.year,
            month: monthNames[order._id.month - 1], 
            count: order.count
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching order count by month range:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


const getOrderCountByMonthAndFoodCategory = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { startYear, startMonth, endYear, endMonth, foodCategory } = req.query;

        // Log the parameters received in the query (only once)
        console.log("Received GET request:", { admin_id, startYear, startMonth, endYear, endMonth, foodCategory });

        if (!admin_id || !foodCategory || !startYear || !startMonth || !endYear || !endMonth) {
            return res.status(400).json({ message: "Admin ID, food category, start year, start month, end year, and end month are required." });
        }

        // Convert start and end months to Date objects
        let start = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
        let end = new Date(parseInt(endYear), parseInt(endMonth), 0, 23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ message: "Start date must be before end date." });
        }

        const orders = await Order.find({
            admin_id,
            createdAt: { $gte: start, $lte: end },
        });

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let result = [];

        // Iterate through orders
        for (let order of orders) {
            let foodCategoryOrderCount = 0;

            // Loop through items in the order
            for (let item of order.items) {
                const food = await Food.findById(item.foodId);  // Find food details
                if (food && food.foodCategory.toLowerCase() === foodCategory.toLowerCase()) {
                    foodCategoryOrderCount++;  // Increment count if category matches
                }
            }

            if (foodCategoryOrderCount > 0) {
                // Get the year and month from the order's createdAt
                const year = order.createdAt.getFullYear();
                const month = order.createdAt.getMonth(); // 0-based month

                // Add the result to the response array
                result.push({
                    year: year,
                    month: monthNames[month],  // Get the month name from the array
                    foodCategory: foodCategory,
                    count: foodCategoryOrderCount
                });
            }
        }

        // Initialize the date variables outside of the filter
        const startYearInt = parseInt(startYear);
        const startMonthInt = parseInt(startMonth) - 1;
        const endYearInt = parseInt(endYear);
        const endMonthInt = parseInt(endMonth) - 1;

        // Filter the results by the requested month range
        const filteredResults = result.filter(item => {
            const itemYear = item.year;
            const itemMonth = monthNames.indexOf(item.month);

            return (
                (itemYear > startYearInt || (itemYear === startYearInt && itemMonth >= startMonthInt)) &&
                (itemYear < endYearInt || (itemYear === endYearInt && itemMonth <= endMonthInt))
            );
        });

        // Group results by month and year
        const groupedResult = filteredResults.reduce((acc, item) => {
            const key = `${item.year}-${item.month}`;
            if (!acc[key]) {
                acc[key] = { ...item };
            } else {
                acc[key].count += item.count;
            }
            return acc;
        }, {});

        // Format the response as an array
        const finalResponse = Object.values(groupedResult);

        res.status(200).json(finalResponse);
    } catch (error) {
        console.error("Error fetching order count by month and food category:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



const getOrderCountByMonthAndOrderType = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { startYear, startMonth, endYear, endMonth, orderType } = req.query;

        if (!admin_id || !startYear || !startMonth || !endYear || !endMonth || !orderType) {
            return res.status(400).json({ message: "Admin ID, start year, start month, end year, end month, and orderType are required." });
        }

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Ensure year and month are parsed correctly
        const startYearInt = parseInt(startYear, 10);
        const startMonthInt = parseInt(startMonth, 10);
        const endYearInt = parseInt(endYear, 10);
        const endMonthInt = parseInt(endMonth, 10);

        // Construct correct start and end dates
        const startDate = new Date(Date.UTC(startYearInt, startMonthInt - 1, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(endYearInt, endMonthInt, 0, 23, 59, 59, 999));

        console.log("Start Date (Fixed):", startDate.toISOString());
        console.log("End Date (Fixed):", endDate.toISOString());

        // Convert admin_id if stored as ObjectId
        let adminIdQuery = admin_id;
        if (mongoose.Types.ObjectId.isValid(admin_id)) {
            adminIdQuery = new mongoose.Types.ObjectId(admin_id);
        }

        // Aggregate query to group by year and month while filtering by orderType
        const orders = await Order.aggregate([
            {
                $match: {
                    admin_id: adminIdQuery,
                    orderType: orderType,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        console.log("Filtered Orders:", orders);

        // Format the response
        const response = orders.map(order => ({
            year: order._id.year,
            month: monthNames[order._id.month - 1], // Convert month number to name
            orderType: orderType,
            count: order.count
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching order count by month and order type:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



const getOrderCountByMonthAndFoodName = async (req, res) => {
    try {
        const { admin_id } = req.params;
        const { startYear, startMonth, endYear, endMonth, foodName } = req.query;

        if (!admin_id || !startYear || !startMonth || !endYear || !endMonth || !foodName) {
            return res.status(400).json({ message: "Admin ID, start year, start month, end year, end month, and foodName are required." });
        }

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Ensure correct year handling
        const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
        const endDate = new Date(parseInt(endYear), parseInt(endMonth), 0, 23, 59, 59, 999);

        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        // Convert admin_id if stored as ObjectId
        let adminIdQuery = admin_id;
        if (mongoose.Types.ObjectId.isValid(admin_id)) {
            adminIdQuery = new mongoose.Types.ObjectId(admin_id);
        }

        // Aggregate query to group by year and month while filtering by foodName
        const orders = await Order.aggregate([
            {
                $match: {
                    admin_id: adminIdQuery,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $unwind: "$items" // Unwind the items array
            },
            {
                $lookup: {
                    from: "foods",
                    localField: "items.foodId",
                    foreignField: "_id",
                    as: "foodDetails"
                }
            },
            {
                $unwind: "$foodDetails" // Unwind the foodDetails array
            },
            {
                $match: {
                    "foodDetails.foodName": { $regex: new RegExp(foodName, "i") } // Case-insensitive match
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        console.log("Filtered Orders:", orders);

        // Format the response
        const response = orders.map(order => ({
            year: order._id.year,
            month: monthNames[order._id.month - 1], // Convert month number to name
            foodName: foodName,
            count: order.count
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching order count by month and food name:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




module.exports = { getOrderCountByAdmin, getOrderCountByAdminAndFoodName, getOrderCountByFoodCategory, getOrderCountOrderType, getOrderCountByMonthRange, getOrderCountByMonthAndFoodCategory, getOrderCountByMonthAndOrderType, getOrderCountByMonthAndFoodName };
