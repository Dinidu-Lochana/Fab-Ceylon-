const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    type: String,
    requried: true,
  },
  contactNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

CustomerSchema.statics.signup = async function (name,contactNumber, password) {
    
    if (!name) {
      throw Error(
        "name cannot be empty"
      );
    }
    if(!contactNumber){throw Error("contact number cannot be empty")}
    if(!password){throw Error("password cannot be empty")}

    if (!validator.isStrongPassword(password)) {
      throw Error("Please enter a stronger password");
    }
  
    const exists = await this.findOne({ contactNumber });
    if (exists) throw Error("This contact Number has already been used");
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  
    const createdCustomer = this.create({ name,contactNumber, password: hash });
    return createdCustomer;
  };
  
  CustomerSchema.statics.login = async function (contactNumber, password) {
    if(!contactNumber){throw Error("contact number cannot be empty")}
    if(!password){throw Error("password cannot be empty")}
  
    const returnedCustomer = await this.findOne({ contactNumber });
    if (!returnedCustomer) throw Error("This contact number is not registered");
  
    const matching =await bcrypt.compare(password, returnedCustomer.password);
    console.log(matching)
    if (!matching) throw Error("Incorrect password");
  
    return returnedCustomer;
  };

module.exports = mongoose.model("customer", CustomerSchema);