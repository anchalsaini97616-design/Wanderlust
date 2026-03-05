const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../models/listing.js");
const{isloggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer  = require('multer')
const {cloudinary}=require("../cloudconfig.js");
const upload = multer({dest:"uploads/"});

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createNewForm));

//NEW ROUTE
router.get("/new",isloggedIn,listingController.renderNewForm);


//EDIT ROUTE
router
.get("/:id/edit",isloggedIn,isOwner,wrapAsync(listingController.rendereditForm));
router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isloggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.updateform))
.delete(isloggedIn,isOwner,wrapAsync(listingController.destroy));



module.exports=router;