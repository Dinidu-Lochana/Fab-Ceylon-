const validator = require('validator');
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    cafeName :{
        type:String,
        required:true,
        unique:true,
    },
    contactNumber : {
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
});

AdminSchema.statics.adminSignup = async function (cafeName,contactNumber,password) {
    if(!cafeName){
        throw Error(
            "Cafe name cannot be Empty"
        );
    }
    if(!contactNumber){
        throw Error(
            "Contact Number cannot be Empty"
        );
    }
    if(!password){
        throw Error(
            "Password cannot be Empty"
        );
    }

    if(!validator.isStrongPassword(password)){
        throw Error("Please enter a Strong Password");
    }

    const exists = await this.findOne({cafeName});
    if (exists) throw Error("This Cafe Name has already been used");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdAdmin = this.create({cafeName,contactNumber, password:hash});
    return createdAdmin;
};

AdminSchema.statics.adminLogin = async function (cafeName, password)
{
    if(!cafeName){
        throw Error("Cafe Name cannot be Empty")
    }
    if(!password){
        throw Error("Password cannot be Empty")
    }

    const returnedAdmin = await this.findOne({cafeName});
    if(!returnedAdmin) {
        throw Error("This Cafe Name is not registerd");
    }

    const matching = await bcrypt.compare(password, returnedAdmin.password);
    console.log(matching)
    if(!matching){
        throw Error("Incorrect password");
    }
    return returnedAdmin;
}

module.exports = mongoose.model("admin",AdminSchema);

