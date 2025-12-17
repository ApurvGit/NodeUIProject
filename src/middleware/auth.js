const { verify } = require('jsonwebtoken')
const { userModel } = require('../models/user');

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log(token)
  if (!token) {
    throw new Error("Invalid User")
  }
  try {
    const decodedToken = await verify(token, 'DEV@NodePratice789#!@')
    const { emp_id } = decodedToken;
    const user = await userModel.findOne({ emp_id: emp_id });

    if (!user) {
      throw new Error("Invalid user")
    }
    req.user = user
    next()

  } catch (err) {
    res.status(400).send("ERROR", +err.message)
  }
}

module.exports = { userAuth }