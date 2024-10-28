const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FoodSchema = new Schema(
    {
        foodName: { 
            type: String, 
            required: true 
        },
        price: { 
            type: Number, 
            required: true
        },
        description:{
            type:String, 
            required:true
        },
        foodCategory:{
            type:String,
            required:true
        },
        isDeliveryAvailable:{
            type:Boolean,
            required:true
        },
        admin_id:{
            type:String,
            required:true,
        },
        image: { 
            type: String,
            required: true
        }
});



module.exports = mongoose.model("Food",FoodSchema);