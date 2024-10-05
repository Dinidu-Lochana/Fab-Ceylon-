const mongoose = require("mongoose");

const Schema = mongoose.Schema;

export const FoodSchema = new Schema(
    {
        foodName: { type: String, required: true },
        price: { type: Number, required: true },
        description:{type:String, required:true},
        foodCategory:{type:String,required:true},
        isDeliveryAvailable:{type:String,required:true},
        //new add
        foodCat:{type:String,required:true},

});



module.exports = mongoose.model("food",FoodSchema);