const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/expresserror.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedin=(req,res,next)=>{
    // console.log(req.user,req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        return res.redirect("/login");
    
    
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
};
module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permission you are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
module.exports.validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        let errMsg=result.error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
module.exports.isRevOwner=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.owner.equals(res.locals.currUser._id)){
        req.flash("error","you didnt create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}