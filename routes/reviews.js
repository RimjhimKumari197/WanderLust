const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const{validateReview,isLoggedin,isRevOwner}=require("../middleware.js");

const reviewController=require("../controller/review.js");

//reviews
//post
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview));
//delete
router.delete("/:reviewid",isLoggedin,isRevOwner,wrapAsync(reviewController.destroyReview));
module.exports=router;