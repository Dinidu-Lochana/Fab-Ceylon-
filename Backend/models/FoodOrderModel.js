const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FoodOrderSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        items: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                foodName: {
                    type: String,
                    required: true,
                },
                ratings: [
                    {
                        userId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "User",
                        },
                        rating: {
                            type: Number,
                            min: 1,
                            max: 5,
                        },
                    },
                ],
            },
        ],
        orderType: {
            type: String,
            enum: ["Pick-up", "Delivery"],
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"],
            default: "Pending",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Card"],
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        orderDescription: {
            type: String,
        },
    },
    { timestamps: true } 
);



module.exports = mongoose.model("Order",FoodOrderSchema);