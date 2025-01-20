if(process.env.NODE_ENV!="production"){
    require('dotenv').config();

}
// console.log(process.env.SECRET) ;

const express=require("express");
const app=express();
const path=require("path");
const mongoose = require('mongoose');
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/expresserror");
const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const port=process.env.PORT||8080;
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local")
const User=require("./models/user.js");
const user=require("./routes/user.js");
// const MONGO_URL='mongodb://127.0.0.1:27017/Wanderlust'
const dbUrl=process.env.ATLASDB;
main().then((res)=>{
    console.log("connection successfull");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);

}
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("error in mongo session store");
})
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true

}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success)
    next();
})


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

//error handling middle ware
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    res.status(status).render("error.ejs",{message});
    // res.status(status).send(message);
});
app.listen(port,(res,req)=>{
    console.log("app is listening");
})