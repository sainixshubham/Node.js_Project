const { Router } = require("express");
const cartModel = require("../models/cartModel");
const ordersHistoryModel = require("../models/orderHistor");
const PaymentRoute = Router();
const stripe = require ('stripe')(process.env.STRIPE_SECRET_KEY)

PaymentRoute.post('/payment',async( req,res)=>{
  let userCartData = await cartModel.find({user:req.session.userId})
  let final =[]
  userCartData.map((k)=>{
      let product1={
          price_data: {
            currency: "usd",
            unit_amount: k.product.price * 100,
            product_data: {
              name: k.product.title,
            },
          },
          quantity: k.quantity,
        }
  
        final.push(product1)
     
  })
   const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: final,
          success_url: "http://localhost:3000/afterPayment",
        });
  
        res.redirect(303,session.url)
  })
  
  PaymentRoute.get("/afterPayment", async (req, res) => {
      let userCartData = await cartModel.find({user:req.session.userId})
  
      let obj = new ordersHistoryModel({
          user:req.session.userId,
          cart:userCartData,
          status:"approved",
          date:Date(),
      })
  
      obj.save()
  
  let deleteCart = await cartModel.deleteMany({user:req.session.userId})
  res.redirect("/")
  })
  
 

module.exports = PaymentRoute ;