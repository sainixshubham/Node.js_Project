const { Router } = require("express");
const userModel = require("../models/userModel");
const forgotPasswordRoute = Router()
var nodemailer = require('nodemailer');

// Function to generate OTP 
function generateOTP() { 
    let digits = '0123456789'; 
    let OTP = ''; 
    let len = digits.length 
    for (let i = 0; i < 6; i++) { 
        OTP += digits[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
} 


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ramansaini9316@gmail.com',
      pass: 'psvu abnp nrpw held'
    }
  });


forgotPasswordRoute.get('/forgotpass',(req,res)=>{
    res.render('FrontEnd/FrontEndForgotPassword')
})



forgotPasswordRoute.post('/forgotpass', async (req,res)=>{
  let user = await userModel.findOne({email:req.body.email})
  if(user){
    
    let otp = generateOTP()
    req.session.userPassUpdateOtp=otp
     req.session.userEmail=req.body.email
    var mailOptions = {
        from: 'ramansaini9316@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: otp
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    


    res.render('FrontEnd/FrontEndOtpVerify')
  }else{
    res.redirect("/forgotpass/?msg=userNotExist")
  }

})


forgotPasswordRoute.post('/verifyOtp',(req,res)=>{

  if(req.body.otp == req.session.userPassUpdateOtp){
    res.render('FrontEnd/FrontEndUpdatePassword')
  }else{
    res.render('FrontEnd/FrontEndOtpVerify')
  }

})





forgotPasswordRoute.post('/updatepass',async(req,res)=>{
  let email=req.session.userEmail
 if (req.body.newPassword==req.body.confirmPassword) {
  
   await userModel.findOneAndUpdate({email:email},{password:req.body.newPassword})
res.redirect("/userLogin")
 }else{
  res.redirect("/verifyOtp")
 }


    
})



module.exports =forgotPasswordRoute