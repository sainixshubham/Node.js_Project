const { Router } = require("express");
const adminModel = require("../models/adminModel");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");

const frontEndRoute =Router()

const userSessionChecker = (req, res, next) => {
    if (req.session.userId) {
       next()
    } else {
      
       res.redirect("/userLogin")
 }
 }

frontEndRoute.get('/',(req,res)=>{
    res.render('FrontEnd/FrontEndHome')
})

frontEndRoute.get('/product',async(req,res)=>{
    let product= await productModel.find()
    res.render('FrontEnd/FrontEndProduct',{product})
})


frontEndRoute.get("/productdetail/:id", async(req, res) => {
    let category= await categoryModel.find()
    let product = await productModel.find()
    let productDetail= await productModel.findOne({ _id :req.params.id})
    res.render("FrontEnd/FrontEndProductDetail",{productDetail,category,product})
});
// frontEndRoute.get('/cart',(req,res)=>{
//     res.render('FrontEnd/FrontEndCart')
// })

frontEndRoute.get('/wishlist',(req,res)=>{
    res.render('FrontEnd/FrontEndWishlist')
})
frontEndRoute.get('/contact',(req,res)=>{
    res.render('FrontEnd/FrontEndContact')
})
frontEndRoute.get('/userLogin',(req,res)=>{
    res.render('FrontEnd/FrontEndLoginForm')
})

// frontEndRoute.get('/myaccount',(req,res)=>{
//     res.render('FrontEnd/FrontEndMyAccount')
// })
frontEndRoute.get('/checkout', userSessionChecker,async (req, res) => {
         let checkLogin = req.session.userId ? true : false
    res.render('FrontEnd/FrontEndCheckout')
})


frontEndRoute.post("/searchProduct", async(req, res) => {
    
    let product = await productModel.find({
        title: { $regex:`^${req.body.search}.*`, $options:"si" ,}
    });
    let category= await categoryModel.find()
    res.render("FrontEnd/FrontEndProduct",{product,category});
});

frontEndRoute.get("/searchByCategory/:id", async(req,res)=>{
    let category= await categoryModel.find()
   let product= await productModel.find({category : req.params.id})
res.render("searchByCategory",{product,category})
});


frontEndRoute.get('/adminLogin', function (req, res) {
    res.render("FrontEnd/adminLoginForm");
 })

 frontEndRoute.post('/adminLogin',async function (req, res) {
   let admin =await adminModel.findOne({
    email:req.body.email,
    password:req.body.password
 })

 if(admin==null || admin == undefined){
    res.redirect("/adminLogin?msg=notfound")
 }else{
    console.log("admin::",admin.id);
    
    req.session.adminId=admin._id
    res.redirect("/admin")
    
 } })

 
 frontEndRoute.post('/registerAdmin',async function (req, res) {
 let obj = new adminModel(req.body)
  obj.save()
   res.send('post')
 })        
 
 
 frontEndRoute.get("/logout",(req,res)=>{
 req.session.destroy();
 res.redirect('/')
 })



 // user login route start
 frontEndRoute.get('/userLogin', function (req, res) {
    res.render("FrontEnd/FrontEndLoginForm");
 })

 frontEndRoute.post('/userLogin',async function (req, res) {
   let user =await userModel.findOne({
    email:req.body.email,
    password:req.body.password
 })

 if(user == null || user == undefined){
    res.redirect("/userLogin?msg=notfound")
 }else{
    console.log("user::",user.id); 
    
    req.session.userId=user._id 
    res.redirect("/")
    
 } })

 
 frontEndRoute.post('/registeruser',async function (req, res) {
 let obj = new userModel(req.body)
  obj.save()
   res.send('post')
 })        

// user login route end



// my account route start

frontEndRoute.get('/myaccount', userSessionChecker, async (req, res) => {
    let checkLogin = req.session.userId ? true : false
    let id = req.session.userId
    let cartTable = await cartModel.find()
    let user = await userModel.findOne({ _id: id })
    console.log(user);
    
    res.render("FrontEnd/FrontEndMyAccount", { user, checkLogin, cartTable});
 });
// my account route end 

 
let checkCartProduct = async (req,res,next)=>{
    let product = await productModel.findOne({_id:req.params.id})
    let findEntry = await cartModel.findOne({user:req.session.userId , product:product})
    if(findEntry){
      console.log("existed");
    //   res.redirect("/productCart")
      let quantity =findEntry.quantity +1
      await cartModel.findOneAndUpdate({user:req.session.userId , product:product},{quantity:quantity})
      res.redirect(`/productdetail/${req.params.id}`)
  }else{
        console.log("not existed");
next()
}


}

// Increase quantity
frontEndRoute.get('/increase/:id', async (req, res) => {
    let id=req.params.id
  let cartItem = await cartModel.findById({_id:id});
  if (cartItem) {
    cartItem.quantity += 1;
    cartItem.save();
  }
  res.redirect("/productCart");
});

/// decrease quantity
frontEndRoute.get("/decrease/:id", async (req, res) => {
  let id=req.params.id
  let cartItem = await cartModel.findById({_id:id});
  if (cartItem && cartItem.quantity>1){
    cartItem.quantity -= 1;
     cartItem.save();
  }
  res.redirect("/productCart");
});

// cart route start

frontEndRoute.get('/addToCart/:id', userSessionChecker, checkCartProduct,async(req,res)=>{
    let productId = req.params.id
    let product = await productModel.findOne({_id:productId})
    let userId=req.session.userId
    
    let obj = new cartModel({
       user:userId,
       product:product,
      quantity:1,
    })
    obj.save()
    res.redirect(`/productdetail/${req.params.id}`)
    })
    
    frontEndRoute.get("/deleteProduct/:id",async(req,res)=>{
       await cartModel.findByIdAndDelete({_id:req.params.id})
        res.redirect("/productCart")
      
      })
    
    frontEndRoute.get('/productCart', userSessionChecker,async (req, res) => {
         let checkLogin = req.session.userId ? true : false
         let cartData = await cartModel.find({user:req.session.userId})
         console.log(cartData);
         
         res.render("frontEnd/FrontEndCart" ,{checkLogin ,cartData});
    })
 
    // cart route end  

    // like product route start

    frontEndRoute.get("/likeProduct/:id", async (req, res) => {
        let productId = req.params.id
        let product = await productModel.findOne({ _id: productId })
        let userId = req.session.userId

        let obj = new cartModel({
            user: userId,
            product: product,
            quantity: 1,
        })
        obj.save()
        res.redirect(`/productdetail/${req.params.id}`)
    })
 //        like product route end



module.exports = frontEndRoute;