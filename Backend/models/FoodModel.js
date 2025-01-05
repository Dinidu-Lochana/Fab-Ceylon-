const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FoodSchema = new Schema(
    {
        foodName: {
            type: String,
            required: true,
            trim: true, // Remove extra spaces
        },
        price: {
            type: Number,
            required: true,
            min: 1, // Price must be greater than 0
        },
        description: {
            type: String,
            required: true,
            trim: true, // Remove extra spaces
        },
        foodCategory: {
            type: String,
            required: true,
            enum: ["Starter", "Main Course", "Dessert", "Beverage","Mojito","dhdfhfgh"], // Example categories
            trim: true,
        },
        isDeliveryAvailable: {
            type: Boolean,
            required: true,
            default: false,
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        // New fields to store ratings
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5, // Rating range 0-5
        },
        totalRatings: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt`
    }
);

module.exports = mongoose.model("Food", FoodSchema);
