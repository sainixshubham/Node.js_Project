const mongoose = require("mongoose")

const productSchema =new mongoose.Schema({
    title:String,
    category:String,
    price:Number,
    description:String,
    descountpercentage:Number,
    stock:Number,
    rating:Number,
    warentyinformation:String,
    image:String
});

const productModel = mongoose.model('product',productSchema);
module.exports=productModel;