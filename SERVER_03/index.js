const http=require("http")
const fs= require("fs")

const myServer=http.createServer((req,res)=>{
  const log =`${Date.now()}: ${req.url}new req. rec.\n`
  fs.appendFile("log.txt",log,(err,data)=>{
    switch(req.url){
      case '/': res.end("Homepage");
      break
      case '/about': res.end("i am somesh shukla");
      break
      default : res.end("404")
    }
    res.end("hello from server")
  })
});

myServer.listen(8000, ()=>console.log("somesh's server started"));