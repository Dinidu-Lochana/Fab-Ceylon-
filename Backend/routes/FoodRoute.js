const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { upload, createFood, getFoods ,updateFood , deleteFood} =  require('../controllers/FoodController');

router.post('/createfood', upload.single('image'), createFood);

router.get('/getfoods',getFoods);

router.patch('/updatefood/:id', upload.single('image'), updateFood);

router.delete('/deletefood/:id', RequireAuth, deleteFood);

module.exports =  router;



