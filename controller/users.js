const User=require("../models/user.js");

module.exports.rendersignup=(req,res)=>{
    res.render("user/signup.ejs");
};
module.exports.signupform=(async(req,res)=>{
    try{
        let{username,password,email}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listing");
    });    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});
module.exports.renderlogin=(req,res)=>{
    res.render("user/login.ejs");
};
module.exports.loginform=(async(req,res)=>{
    req.flash("success","Welcome to Wanderlust.You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
});
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listing");
    })};