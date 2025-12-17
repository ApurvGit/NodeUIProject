const requestApp = require("express").Router();

const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { userModel } = require("../models/user");

requestApp.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  const user = req.user
  try {

    const toUserId = req.params.toUserId;
    const status = req.params.status;
    console.log(status)
    const allowedRoles = ["Ignored", "Interested"];
    if (!allowedRoles.includes(status)) {
      res.send("Invalid Status", +status)
    }

    const toUser = await userModel.findOne({ _id: toUserId })
    const fromUserId = user._id;
    if (!toUser) {
      return res.status(400).send("Invalid to User  ")
    }
    const ifConnectionRequestExits = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    })

    if (ifConnectionRequestExits) {
      return res.status(400).send("Connection Request already exits");
    }
    const connectionRequestModeltoBeSave = new ConnectionRequestModel({ fromUserId, toUserId, status })
    const data = await connectionRequestModeltoBeSave.save();
    res.json({
      message: "Connection Request send Sucessfully",
      data
    })

  } catch (err) {
    console.log(err)
    res.send("Failed to send connection request" + user.firstName);
  }
})

requestApp.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  try {
    const { requestId, status } = req.params
    const allowedStatus = ["Accepted", "Rejected"];
    if (!allowedStatus.includes(status)) {
      return res.send("Invalid Status")
    }
    const fromUserId = loggedInUser._id;
    const connectionRequest = await ConnectionRequestModel.findOne({
      fromUserId: requestId,
      toUserId: loggedInUser._id,
      status: "Interested"
    }).populate("fromUserId", "firstName photoUrl lastName age city photoUrl").populate("toUserId", "firstName")
    console.log(connectionRequest, requestId, loggedInUser._id)
    if (!connectionRequest) {
      return res.status(400).send("Connection not found")
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({
      message: "Connection Sucess",
      data
    })
  } catch (error) {
    console.log(error)

    res.send("ERROR:" + error.message);
  }
})

module.exports = requestApp