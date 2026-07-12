var express = require('express');
var session = require('express-session');
const { mongoose } = require('mongoose');
const path = require('path');
const frontEndRoute = require('./routes/frontEndRoute');
const adminRoute = require('./routes/adminRoute');
const PaymentRoute = require('./routes/PaymentRoute');
const forgotPasswordRoute = require('./routes/forgotPasswordRoute');

const cors = require('cors');
const corsRoute = require('./routes/corsRoute');
var app = express();

 



app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));


const corsOptions = {
    origin: '*', // Restrict to a specific domain
    methods: 'GET,POST',          // Allow specific HTTP methods
     allowedHeaders: 'Content-Type' // Allow specific headers
};

app.use(cors(corsOptions)); 


app.set('view engine', 'ejs');
app.set('views','./views');
// app.set('views','./views/FrontEnd');

const mongoURI = 'mongodb://localhost:27017/myfirstdatabase'; 
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB'))

app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,             // Prevents saving unchanged sessions
    saveUninitialized: false,  // Prevents saving uninitialized session
}));


const adminsessionChecker=(req,res,next)=>{
    if(req.session.adminId){
        next()
    }else{
        res.redirect('/adminLogin')

    }
}


app.use("/",frontEndRoute)
app.use("/",PaymentRoute)
app.use("/",forgotPasswordRoute)
app.use("/",corsRoute)
app.use("/admin",adminsessionChecker,adminRoute)


app.listen(3000);