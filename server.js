// 1 - Dependencies
const express = require("express");
const path = require("path")
const mongoose = require('mongoose');
const passport = require("passport")
const expressSession = require("express-session")
const MongoStore = require("connect-mongo")
const moment = require ('moment')
const methodOverride = require('method-override')

const multer = require("multer");


require('dotenv').config();



//import routes

const vendorRoutes = require("./routes/vendorRoutes")

// 2 - Instantiations
const app = express();
const port = 3002

// 3 - Configurations
app.locals.moment = moment;
//setting up mongodb connections
mongoose.connect(process.env.MONGODB_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });


// setting view engine to pug
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


// 4 - Middleware    
//MIDDLE WARE
//method-override
app.use(methodOverride('_method'));
// app.use(express.static('public'));  //static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"))
app.use(express.urlencoded({extended:true}))  // this helps to pass data from forms
app.use(express.json()); // optional for JSON
//express session configurations
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl:process.env.MONGODB_URL}),
  cookie: {maxAge:24*60*60*1000}  //one day - what we specified here is how long the cookie should last in a day
}))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


//passport configs
app.use(passport.initialize());
app.use(passport.session());


// Simple request time logger
app.use('/home', (req, res, next) => {           //this is where we add the file or route we are focusing on, which is "home" now, but you can put any route you want to focus on or leave it empty and i will monitor all routes
   console.log("A new request received at " + Date.now());
   next();  
});



// 5 - Routes
//using imported routes

app.use("/vendor",vendorRoutes)













//NON EXISTENT ROUTE
//this is a non existing route it should be at the bottom but above the app listen which is the last down.
app.use((req, res) => {
  res.status(404).send('oops! route not found.')
})
// 6 - Bootstrapping Server
//this should always be the last line in this file
app.listen(port, () => console.log(`listening on port ${port}`));