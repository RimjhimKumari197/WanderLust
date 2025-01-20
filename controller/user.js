const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
   res.render("users/signup");
}
module.exports.signup=async(req,res)=>{
    try {
        let{username,email,password}=req.body;
    const newUser=new User({
            email,
            username
        });
    let registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
   
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","user registered successfully");
        res.redirect("/listings");
    });
    
        
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
    
};
module.exports.renderLoginForm=(req,res)=>{
   res.render("users/login");

};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl||"/listings"
    
    res.redirect(redirectUrl);

};
module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings")
    })
}