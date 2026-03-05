const express=require("express");
const router=express.Router();

//index
router.get("/",(req,res)=>{
    res.send("get for users");
});
//show
router.get("/:id",(req,res)=>{
    res.send("get for show users");
});
//delete
router.delete("/:id",(req,res)=>{
    res.send("get for delete user id");
});
module.exports=router;