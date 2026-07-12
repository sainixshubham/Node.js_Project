const mongoose= require("mongoose");



const ordersHistory = new mongoose.Schema({
   user:String,
  cart:Array,
 status:String,
 date:String
})

const ordersHistoryModel = mongoose.model("orders",ordersHistory)
module.exports = ordersHistoryModel ;