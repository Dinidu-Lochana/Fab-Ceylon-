require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require('multer');

const customerRoutes = require("./routes/CustomerRoute");
const adminRoutes =  require("./routes/AdminRoute");
const foodRoutes = require("./routes/FoodRoute");
const foodMenuRoutes = require("./routes/FoodMenuRoute");
const foodOrderPageRoutes = require("./routes/FoodOrderRoute");
const foodOrderAdminPageRoutes = require("./routes/FoodOrderAdminRoute");
const mongoose = require("mongoose");

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/api/customers",customerRoutes);
app.use("/api/admins",adminRoutes);
app.use("/api/admins",foodRoutes);
app.use("/api/customers",foodMenuRoutes);
app.use("/api/customers/order", foodOrderPageRoutes);
app.use("/api/admins/order", foodOrderAdminPageRoutes);



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
   
    app.listen(process.env.PORT, () => {
      console.log("Database Connection successful!, listening in on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

