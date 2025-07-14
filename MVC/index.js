const express =require("express")
const {ConnectMongoDB}=require('./connection')

const {logReqRes} =require("./middlewares")

const userRouter = require("./routes/user");

const app=express();
const PORT=8000;


//connection
ConnectMongoDB("mongodb://localhost:27017/crud").then(()=> console.log("mongodb connected"));


//middleware Plugin
app.use(express.urlencoded({extended:false}));
app.use(logReqRes("log.txt"));

//routes
app.use("/api/user",userRouter);


app.listen(PORT,()=>console.log(`Server Started at PORT: ${PORT}`))