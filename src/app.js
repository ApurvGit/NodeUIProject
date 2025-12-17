const express = require("express");
require('./auth/database')
const { userModel } = require('./models/user');
const { decode, sign, verify } = require("jsonwebtoken");
const { validatorSignUpdata } = require("./utils/validations");
const { userAuth } = require('./middleware/auth')
const cookieParser = require("cookie-parser");
const authRouter = require("./router/userRouter");
const profileRouter = require("./router/profileRouter");
const requestRouter = require("./router/request");
const viewConnectionRequests = require("./router/profileViewRouter");
const { hash, compare } = require("bcrypt");
const cors = require('cors')

const app = express();

app.use(express.json())

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", viewConnectionRequests);


app.listen(4444, () => {
    console.log("Server restarted")
})