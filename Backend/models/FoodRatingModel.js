const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  foodCategory: { type: String, required: true },
  image: { type: String },
  items: [
    {
      price: { type: Number },
      // other item-specific details
    }
  ],
  orderDescription: { type: String },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 }
    }
  ],
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Food', foodSchema);
