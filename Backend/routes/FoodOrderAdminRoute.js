const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getOrders, deleteOrder, updateOrder } =  require('../controllers/FoodOrderAdminController');



router.get('/getorders',getOrders );

router.patch('/updateorder/:id', updateOrder);

router.delete('/deleteorder/:id', RequireAuth, deleteOrder);



module.exports =  router;



