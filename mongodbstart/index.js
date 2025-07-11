const express =require("express")
const fs=require("fs")
const mongoose= require("mongoose");
const { timeStamp } = require("console");

mongoose.connect("mongodb://localhost:27017/crud")
.then(()=>console.log("mongoDB Connected"))
.catch(err=>console.log("err in mongo",err));

//schema
const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  jobTitle:{
    type:String
  },
  gender:{
    type:String
  }
}, {timestamps:true})
const user=mongoose.model("user",userSchema);

const app=express();
const PORT=8000;

//middleware Plugin
app.use(express.urlencoded({extended:false}));

//my middleware
app.use((req,res,next)=>{
  fs.appendFile("log.txt",`\n${Date.now()}:${req.ip} ${req.method}: ${req.path}\n`,
  (err,data)=>{
    next();
  }
);
});

//database se user nikalo ( chrome pr http://localhost:8000/users)
app.get("/users",async (req,res)=>{
  const allDbUsers = await user.find({});   //empty {} mtlb saare users le aao
  const html=`
  <ul>
  ${allDbUsers.map((user)=>`<li>${user.firstName}---${user.email}---${user.gender}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});

//REST API
app.get("/api/users",async(req,res)=>{
  const allDbUsers = await user.find({});
  return res.json(allDbUsers);
});


app.use((req,res,next)=>{
  console.log("hello from middleware 2")
  next();
})



//routes here
//all users
app.get("/api/users",(req,res)=>{
  return res.json(users);
})

app.post("/api/users",async(req,res)=>{
  const body=req.body;
  if(!body || !body.first_name || !body.last_name || !body.email ||!body.gender || !body.job_title){
    return res.status(400).json({msg:"All fields are required"});
  }
  const result = await user.create({
    firstName:body.first_name,
    lastName:body.last_name,
    email:body.email,
    gender:body.gender,
    jobTitle:body.job_title
  });
  return res.status(201).json({msg:"success"});
});


app
.route("/api/users/:id")
.get(async(req,res)=>{
  const userfound=await user.findById(req.params.id);    // use->findById for get

  if(!user) return res.status(404).json({error:"user not found"})
  return res.json(userfound);
})
.patch(async(req,res)=>{
  //edit with user id
  await user.findByIdAndUpdate(req.params.id,{lastName:"changed"})       //use->findByIdAndUpdate(id,parameter to change) for patch
  return res.json({status:"success"});
})
.delete(async(req,res)=>{
  await user.findByIdAndDelete(req.params.id)
    return res.json({ status: "success"});
});


app.listen(PORT,()=>console.log(`Server Started at PORT: ${PORT}`))