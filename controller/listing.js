const Listing=require("../models/listing.js");
const cloudinary = require('cloudinary').v2;

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listing/index.ejs",{alllistings});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("listing/new.ejs");
};
module.exports.showListing=(async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",
        populate:{path:"author"}}
    ).populate("owner");
    if(!listing){
        req.flash("error","listing not existed");
     return res.redirect("/listing");
    }
    res.render("listing/show.ejs",{listing});
});
module.exports.createNewForm = async (req, res) => {
console.log("FILE:",req.file);
    if (!req.file) {
        req.flash("error", "Image is required");
        return res.redirect("/listing/new");
    }
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder: "wanderlust_dev"
     });
console.log("CLOUD RESULT:",result.secure_url);
    const newListing = new Listing({
        ...req.body.listing,
        owner: req.user._id,
        image: {
            url: result.secure_url,  
            filename: result.public_id
        }
    });
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listing");
};
module.exports.rendereditForm=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    };       
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250/e_blur:300");
     res.render("listing/edit.ejs",{listing,originalImageUrl});
};
module.exports.updateform=async(req,res)=>{
    console.log("FILE:",req.file);
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing},{returnDocument:"after"});
    if (typeof req.file!=="undefined") {
        console.log("Uploading to Cloudinary...");
        if(listing.image && listing.image.filename){
            await cloudinary.uploader.destroy(listing.image.filename)
        }
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder: "wanderlust_dev"
     });
     console.log("CLOUD RESULT:",result.secure_url);
        listing.image={
        url: result.secure_url,
        filename: result.public_id
    };
await listing.save();
    }
    req.flash("success","New listing updated");
    res.redirect(`/listing/${id}`);
};    
module.exports.destroy=(async(req,res)=>{
    let{id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","listing deleted");
    res.redirect("/listing");
});
module.exports.index=async(req,res)=>{
        const{category}=req.query;
        console.log("Query Category:",category);
        let alllistings;
        if(category){
            alllistings=await Listing.find({category:{$regex:category,$options:"i"}});
        }else{
            alllistings=await Listing.find({});
        }
        res.render("listing/index.ejs",{alllistings});
    };
module.exports.index=async(req,res)=>{
        const{search}=req.query;
        let alllistings;
        if(search){
            alllistings=await Listing.find({category:{$regex:search,$options:"i"}});
        }else{
            alllistings=await Listing.find({});
        }
        res.render("listing/index.ejs",{alllistings});
    };


