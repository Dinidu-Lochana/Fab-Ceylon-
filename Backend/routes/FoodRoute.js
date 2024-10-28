const express = require("express");
const router = express.Router();
const { upload, createFood, getFoods } =  require('../controllers/FoodController');

router.post('/createfood', upload.single('image'), createFood);
router.get('/foods',getFoods);


module.exports =  router;



