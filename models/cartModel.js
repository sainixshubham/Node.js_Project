const  mongoose  = require("mongoose");



const cartSchema = new mongoose.Schema({
   user:String,
  product:Object,
 quantity:Number
})

const cartModel = mongoose.model("cartData",cartSchema)
module.exports =cartModel;
