const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    
    res.render("listings/index.ejs",{allListings});
};
module.exports.renderNewForm=(req,res)=>{
    console.log(req.user);
    
    res.render("listings/new");
    
};
module.exports.showListing=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
        populate:{
            path:"owner"
        },
    }).populate("owner");
    if(!listing){
    req.flash("error"," listing doesnt exit");
    res.redirect("/listings");

    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};
module.exports.createListing=async(req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    // or let listing=req.body.listing;
    // console.log(listing);
    let url=req.file.path;
    let filename=req.file.filename;
    // console.log(url,"..",filename)
    
    const newListing=new Listing(req.body.listing);
    newListing.image={url,filename};
    // console.log(req.user);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","new listing created");
//    console.log(newListing);
    
    res.redirect("/listings");
    
    
};
module.exports.renderEditForm=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error"," listing doesnt exit");
        res.redirect("/listings");
    
        }
    let original=listing.image.url;
    original=original.replace("/upload","/upload/w_150,h_150")
    res.render("listings/edit",{listing,original})
};
module.exports.updateListing=async(req,res)=>{
    let{id}=req.params;
    
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
    }
    
    req.flash("success"," listing updated");

    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," listing deleted");

    res.redirect("/listings");
}