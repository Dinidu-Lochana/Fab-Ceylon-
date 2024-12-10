const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods} =  require('../controllers/FoodMenuController');

router.get('/getfoods/:admin_id',getFoods);

module.exports = router;



