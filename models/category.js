const { required } = require("joi");
const mongoose=require("mongoose");
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
});
module.exports=mongoose.model("Category",categorySchema);