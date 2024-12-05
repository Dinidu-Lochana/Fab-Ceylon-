const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods} =  require('../controllers/FoodOrderController');

router.get('/getfoods/:cafeName',getFoods);



