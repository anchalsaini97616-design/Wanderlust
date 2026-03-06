if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingrouter=require("./routes/listing.js");
const reviewrouter=require("./routes/review.js");
const userrouter=require("./routes/user.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL)
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const sessionOptions=({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listing",listingrouter);
app.use("/listing/:id/reviews",reviewrouter);
app.use("/",userrouter);

app.use((req,res,next)=>{
    console.log("METHOD",req.method,req.path);
    console.log("PATH",req.path);
    next();
});

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
    let{status=500,message="some error occured"}=err;
    res.status(status).render("error.ejs",{message});
});
app.listen(8080,()=>{
    console.log("server is running on port:8080");
});