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
        adminRef:{
            type:String,
            required:true,
        }
});



module.exports = mongoose.model("Food",FoodSchema);