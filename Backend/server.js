require("dotenv").config();

const express = require("express");
const cors = require("cors");

const customerRoutes = require("./routes/CustomerRoute");
const adminRoutes =  require("./routes/AdminRoute");
const foodRoutes = require("./routes/FoodRoute");
const mongoose = require("mongoose");

const app2 = express();


app2.use(express.json());
app2.use(cors());
app2.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});


app2.use("/api/customers",customerRoutes);
app2.use("/api/admins",adminRoutes);
app2.use("/api/admins",foodRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
   
    app2.listen(process.env.PORT, () => {
      console.log("Database Connection successful!, listening in on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });

