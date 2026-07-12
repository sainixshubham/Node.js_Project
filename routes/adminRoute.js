const { Router } = require("express");
const adminModel = require("../models/adminModel");
const categoryModel = require("../models/categoryModel");
const productModel= require("../models/productModel");
const adminRoute =Router()



adminRoute.get('/',(req,res)=>{
    res.render('admin/adminDashboard')
})
adminRoute.get('/userData',(req,res)=>{
    res.render('admin/adminUserData')
}) 




adminRoute.get("/adminUpdate",async (req, res) => {
    let admin = await adminModel.findById(req.session.adminId);
    res.render("admin/adminUpdateForm", { admin });
});

adminRoute.post("/adminUpdate", async (req, res) => {
    await adminModel.findByIdAndUpdate(req.session.adminId,{
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    res.redirect("/admin");
});

adminRoute.get("/addproduct", async (req, res) => {
    let category = await categoryModel.find()
       res.render('admin/addProduct',{category});
   });



adminRoute.get("/productCategory",async (req, res) => {
    let category = await categoryModel.find()
        res.render('admin/productCategory',{category});
    });
    adminRoute.post('/addCategory' ,(req,res)=>{
        let obj = new categoryModel(req.body)
        obj.save();
        res.redirect('/admin/productCategory')
    });
    //delete product category
adminRoute.post("/deleteCategory",async(req,res)=>{
    let id=req.body.deleteCategory
    await categoryModel.findByIdAndDelete(id);
    res.redirect('/admin/productCategory')
})

//update product category
adminRoute.post('/updateCategory' ,async (req,res)=>{
    let  id = req.body.oldCategory
    let newCategory =  req.body.newCategory
    await categoryModel.findByIdAndUpdate(id,{categoryName:newCategory})
    res.redirect('/admin/productCategory')
})


adminRoute.get("/productTable",async (req, res) => {
    let products = await productModel.find()
    res.render('admin/productTable',{products});
    });
    
    
    
    // add product start 
    var multer = require('multer');
    
    const storage = multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null,'public/uploads');
        },
        filename:function(req,file,cb){
            cb(null,'myproduct' + "-" + Date.now() +'.jpg');
        }
    })
    
    const upload = multer({storage : storage})
    
    adminRoute.post('/addProduct',upload.single('image') ,(req,res)=>{
    
        if(!req.file){
            return res.status(400).send('no file upload ');
        }else{
            let productObj = new productModel({
                title:req.body.title,
                category:req.body.category,
                price:req.body.price,
                description:req.body.description,
                descountpercentage:req.body.discountpercentage,
                stock:req.body.stock,
                rating:req.body.rating,
                warentyinformation:req.body.warentyinformation,
                image:req.file.filename
            });
            productObj.save();
            // res.send("product added")
    
             res.redirect('/admin/')
        } });

    // add product end
    



 adminRoute.get("/updateProduct/:id",async (req, res) => {
        let category = await categoryModel.find()
        let product= await productModel.findById(req.params.id)
        res.render('admin/updateProduct',{category,product});
    });
    
adminRoute.post("/updateProduct/:id",upload.single('image'),async(req,res)=>{
        if(req.file?.filename == null ||req.file?.filename == undefined ){

            let product = await productModel.findOneAndUpdate({_id:req.params.id},req.body )
            console.log(product);
            
        }else{
            
            let product = await productModel.findOneAndUpdate({_id:req.params.id},{...req.body , image:req.file.filename})
            console.log(product);
        }
         res.redirect('/admin/productTable',)
        })


        adminRoute.get("/deleteProduct/:id",async (req, res) => {
            let id = req.params.id;
            await productModel.findByIdAndDelete(id);
            const products = await productModel.find();
            res.redirect('/admin/productTable');
            });



module.exports = adminRoute