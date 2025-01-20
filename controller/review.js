const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    let newReview=new Review({...req.body.review});
    newReview.owner=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," Review Created");
    
    res.redirect(`/listings/${id}`);
    
};
module.exports.destroyReview=async(req,res)=>{
    let{id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    let result= await Review.findByIdAndDelete(reviewid);
    req.flash("success"," Review deleted");

    res.redirect(`/listings/${id}`);
}