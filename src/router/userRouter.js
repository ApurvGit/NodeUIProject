const { sign } = require("jsonwebtoken");
const { userModel } = require("../models/user");
const { validatorSignUpdata } = require("../utils/validations");
const { hash } = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

const authRouter = require("express").Router()

authRouter.post("/signUp", async (req, res) => {
  validatorSignUpdata(req)
  const { password, emailId, emp_id } = req.body
  const hashPassword = await new hash(password, 10);
  const userSave = new userModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    emailId: req.body.emailId,
    password: hashPassword,
    age: req.body.age,
    emp_id: req.body.emp_id,
    city: req.body.city,
    photoUrl: req.body.photoUrl
  })
  try {
    const savedUser = await userSave.save();
    const foundEmailId = await userModel.findOne({ emailId: emailId });
    const isValid = await savedUser.getJwt(password);
    const token = await sign({ emp_id: emp_id }, "DEV@NodePratice789#!@");
    console.log("token", token)
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000)
    })
    res.json({
      message: "User saved sucessfully",
      data: savedUser
    })
    res.send("User saved sucessfully");

  } catch (err) {
    if (err.code === 11000) {
      res.send("Duplicate Email id field")
    }
    console.log(err)
    res.send("Something went wrong");
  }

})

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  const foundEmailId = await userModel.findOne({ emailId: emailId });
  if (!foundEmailId) {
    res.send("Not a Valid user");
  }
  const idPasswordValid = await foundEmailId.getJwt(password);
  if (idPasswordValid) {
    //create jwt token
    const token = await sign({ emp_id: foundEmailId.emp_id }, "DEV@NodePratice789#!@");
    res.cookie("token", token)
    res.send(foundEmailId);
  } else {
    res.send("Wrong Username or password");
  }
})

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Sucessfull")
})



authRouter.get("/user/requests/received1", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: user._id,
      status: "Interested"
    }).populate("fromUserId", "firstName")
    res.json({
      message: "Data fetched Successfully",
      data: connectionRequests
    })
  } catch (err) {
    console.log("ERROR" + err)
    res.send("ERROR", err.message);
  }
})

authRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: user._id, status: "Accepted" },
        { fromUserId: user._id, status: "Accepted" }
      ]
    }).populate("fromUserId", "firstName photoUrl lastName age city photoUrl").populate("toUserId", "firstName photoUrl lastName age city ")
    res.json({ connectionRequests })
  } catch (err) {

  }
})

authRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    //find all connections request which I have send or received
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }]
    }).select("fromUserId toUserId").populate("fromUserId").populate("toUserId");


    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId)
    })
    const users = await userModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: user._id } }

      ]
    }).select("firstName lastName age photoUrl").skip(skip).limit(limit)
    console.log(users)
    res.send(users)
  } catch (error) {
    console.log(error)
    res.send("ERROR", error)
  }
})

module.exports = authRouter;