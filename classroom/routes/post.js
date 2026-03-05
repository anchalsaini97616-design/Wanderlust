const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("get for posts");
});
//show
router.get("/:id",(req,res)=>{
    res.send("get for show posts");
});
//delete
router.delete("/:is",(req,res)=>{
    res.send("get for delete post id");
});
module.exports=router;