const mongoose=require("mongoose")

const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://apurvypatil:YLybv17m9ikGKPSE@employeemanagement.iwa1ljw.mongodb.net/devDb")
}

connectDB().then(()=>{
  console.log("Connection Sucessfull")
}).catch((err)=>{
    console.log("ERROR",err)
})