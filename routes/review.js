const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/reviews.js");
const {validateReview,isloggedIn,isReviewAuthor}=require ("../middleware.js");
const reviewController=require("../controller/review.js");

//REVIEW ROUTE
router.post("/",isloggedIn,validateReview,wrapAsync(reviewController.createNewReview));
//REVIEW DELETE ROUTE
router.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;
