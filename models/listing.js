const mongoose=require("mongoose");
const Reviews = require("./reviews.js");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        filename:String,
        url:String
},
    price:{
        type:Number,
        required:true,min:0
},
    location:{
        type:String,
        required:true
},    
    country:{
        type:String,
        required:true
},
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        required:true
    }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;