const { Router } = require("express");
const productModel = require("../models/productModel");
const corsRoute = Router()



corsRoute.get("/corsAllProducts",async(req,res)=>{
    let products = await productModel.find()
    res.json(products) 
})
corsRoute.get("/corsSingleProduct/:id",async(req,res)=>{
    let product = await productModel.findOne({_id:req.params.id})
    res.json(product)
})

module.exports = corsRoute ;