const { userAuth } = require("../middleware/auth");
const { userModel } = require("../models/user");
const {validIfEditDataIsAllowed}=require("../utils/validations")
const profileRouter=require("express").Router();

profileRouter.get("/profile",userAuth,async (req,res)=>{
    try{
      res.send(req.user)
    }catch(err){
        res.send("Failed to get Profile"+err.message())
    }
})
profileRouter.patch("/profile/update/:emp_id",async(req,res)=>{
    const empId=req.params.emp_id;
    const data=req.body;
    const ALLOWED_FIELDS=["firstName","lastName","city","emp_id"]
    const isUpdatedAllowed=Object.keys(data).every(field=>ALLOWED_FIELDS.includes(field));
    if(!isUpdatedAllowed){
        res.send("Updating fields  not allowed")
    }
    try{
     const updatedData=await userModel.findOneAndUpdate({emp_id:empId},data,{
        returnDocument:"after"
     })
     res.send("User Updated Sucessfully")
    }catch(err){
      res.send("Something went wrong")
    }
})

profileRouter.patch("/profile/editProfile",userAuth,async(req,res)=>{
  if(!validIfEditDataIsAllowed(req)){
    res.send("Edit not allowed");
  }
  const loggedInUser=req.user;
  Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key])
  // console.log(loggedInUser)
  await loggedInUser.save()
  res.send(loggedInUser)
})

module.exports=profileRouter;