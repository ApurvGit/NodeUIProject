const mongoose = require("mongoose");
const { decode, sign, verify } = require("jsonwebtoken");
const { compare } = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    emp_id: {
        type: String,
        required: true,
        unique: true
    },
    emailId: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    photoUrl: {
        type: String,
        index: true,
    },
    age: {
        type: Number,
        default: 25
    },
    gender: {
        type: String
    },
    city: {
        type: String,
        required: true
    }
}, { timestamps: true })

userSchema.methods.getJwt = async function (passwordInputByUser) {

    const user = this
    const isPasswordValid = await compare(passwordInputByUser, user.password);
    return isPasswordValid;
}
const userModel = mongoose.model("User", userSchema);
module.exports = { userModel };