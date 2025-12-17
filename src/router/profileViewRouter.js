const { json } = require("express");
const { userAuth } = require("../middleware/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");

const viewConnectionRequests = require("express").Router();

viewConnectionRequests.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const userList = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'Interested'
        }).populate("fromUserId", "firstName lastName photoUrl city age gender")
        res.send(userList)
    } catch (error) {
        console.log(error)
        res.status(400).send("ERROR", error);
    }
})
module.exports = viewConnectionRequests