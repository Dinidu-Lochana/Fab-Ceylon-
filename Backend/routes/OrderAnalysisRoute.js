const express = require("express");
const router = express.Router();
const { getOrderCountByAdmin, getOrderCountByAdminAndFoodName, getOrderCountByFoodCategory, getOrderCountOrderType, getOrderCountByMonthRange, getOrderCountByMonthAndFoodCategory,getOrderCountByMonthAndOrderType, getOrderCountByMonthAndFoodName } =  require('../controllers/OrderAnalysisController');

router.get('/orders/count/:admin_id', getOrderCountByAdmin);
router.get('/orders/count/food/:admin_id', getOrderCountByAdminAndFoodName);
router.post('/orders/count/category/:admin_id', getOrderCountByFoodCategory);
router.get('/orders/count/type/:admin_id', getOrderCountOrderType);
router.get('/orders/month/count/:admin_id',getOrderCountByMonthRange);
router.get('/orders/month/count/category/:admin_id', getOrderCountByMonthAndFoodCategory);
router.get('/orders/month/count/type/:admin_id',getOrderCountByMonthAndOrderType);
router.get('/orders/month/count/food/:admin_id',getOrderCountByMonthAndFoodName);


module.exports =  router;