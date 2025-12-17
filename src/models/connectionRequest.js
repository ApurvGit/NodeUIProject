const mongoose = require("mongoose");

const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    photoUrl: {
        type: String,
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["Accepted", "Rejected", "Ignored", "Interested"],
            message: 'Incorrect type'
        }
    }

}, {
    timestamps: true
})
connectionRequest.pre("save", function (next) {
    const connRequest = this;
    console.log(this)
    if (connRequest.fromUserId === connRequest.toUserId) {
        throw new Error("Duplicate from user and to User")
    }
    next();
})

const ConnectionRequestModel = mongoose.model("connectionRequest", connectionRequest);
module.exports = { ConnectionRequestModel };