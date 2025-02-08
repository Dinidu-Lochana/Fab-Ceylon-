const express = require("express");
const router = express.Router();
const { getOrderCountByAdmin, getOrderCountByAdminAndFood } =  require('../controllers/OrderAnalysisController');

router.get('/orders/count/:admin_id', getOrderCountByAdmin);
router.post('/orders/count/food/:admin_id', getOrderCountByAdminAndFood);

module.exports =  router;