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
        senderDetails: {
            name: { type: String, required: true },
            contactNumber: { type: String, required: true },
        },
        receiverDetails: {
            name: { type: String },
            contactNumber: { type: String },
            address: { type: String },
        },
        items: [
            {   
                image: { type: String, required: true },
                foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
                foodName: { type: String, required: true },
                ratings: [
                    {
                        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
                        rating: { type: Number, min: 1, max: 5 },
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
        // New fields for Stripe integration
        stripePaymentIntentId: {
            type: String,
            default: null,
          },
          stripeCustomerId: {
            type: String,
            default: null,
          },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        orderDescription: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

// details only if orderType == "Delivery"
FoodOrderSchema.pre("validate", function (next) {
    if (this.orderType === "Delivery") {
        if (!this.receiverDetails || !this.receiverDetails.name || !this.receiverDetails.contactNumber || !this.receiverDetails.address) {
            return next(new Error("Receiver details (name, contact number, address) are required for Delivery orders."));
        }
    }
    next();
});


FoodOrderSchema.index({ userId: 1 });
FoodOrderSchema.index({ adminId: 1 });
FoodOrderSchema.index({ orderType: 1, status: 1 }); 
FoodOrderSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model("Order", FoodOrderSchema);
