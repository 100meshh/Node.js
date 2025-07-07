const http=require("http")
const fs= require("fs")
const url=require("url")

const myServer=http.createServer((req,res)=>{
  if(req.url==="/favicon.ico") return res.end();
  const log =`${Date.now()}: ${req.method} ${req.url}new req. rec.\n`;
  const myUrl=url.parse(req.url,true);

  fs.appendFile("log.txt", log, (err) => {
    if (err) {
      res.end("Logging error");
      return;
    }
    switch(req.url){
      case '/':
        if(req.method==='GET')
           res.end("Homepage");
      break
      case '/about':
        const username=myUrl.query.myname;
        res.end(`hi,${username}`);
        break

      case "/search":
        const searchQuery = myUrl.query.search_query;
        res.end("Here are your results for"+search);
        break
        case "/signup":
          if(req.method==="GET") res.end("This is a sugnup Form");
          else if(req.method==="POST"){
            res.end("success");
          }
      default : res.end("404")
    }
    // res.end("hello from server")
  })
});

myServer.listen(8000, ()=>console.log("somesh's server started"));