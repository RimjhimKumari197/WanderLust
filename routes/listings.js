const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js")
const{isLoggedin}=require("../middleware.js");
const{isOwner,validateListing}=require("../middleware.js");
const ListingController=require("../controller/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage})

//new
router.get("/new",isLoggedin,ListingController.renderNewForm);
router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedin,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createListing));
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put(isLoggedin,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(ListingController.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(ListingController.destroyListing));
router.get("/:id/edit",wrapAsync(ListingController.renderEditForm));
module.exports=router;