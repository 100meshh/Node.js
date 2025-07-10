const express =require("express")
const fs=require("fs")
const users=require("./MOCK_DATA.json")

const app=express();
const PORT=8000;

//middleware Plugin
app.use(express.urlencoded({extended:false}));

//my middleware
app.use((req,res,next)=>{
  fs.appendFile("log.txt",`\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,(err,data)=>{
    next();
  }
);
  })
app.use((req,res,next)=>{
  console.log("hello from middleware 2")
  // return res.json({msg:"hello from middleware 2"});
  return res.end("hello from middleware 2");
  // next();
})



//routes here
//all users
app.get("/api/users",(req,res)=>{
  return res.json(users);
})

app.post("/api/users",(req,res)=>{
  const body=req.body;
  users.push({...body,id:users.length+1});
  fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
  return res.json({status:"success",id:users.length+1});
  });
});


app
.route("/api/users/:id")
.get((req,res)=>{
  const id=Number(req.params.id);
  const user=users.find((user)=>user.id===id);
  return res.json(user);
})
.patch((req,res)=>{
  //edit with user id
  const userId = parseInt(req.params.id);
   const updatedData = req.body;
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
   users[index] = { ...users[index], ...updatedData };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", message: `User with id ${userId} updated` });
  })
})
.delete((req,res)=>{
  const userId = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === userId);
  if (index === -1) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }
  users.splice(index, 1);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", message: `User with id ${userId} deleted` });
  });
});


app.listen(PORT,()=>console.log(`Server Started at PORT: ${PORT}`))