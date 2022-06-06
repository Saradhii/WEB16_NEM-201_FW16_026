const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// app.use((req,res,next)=>{
//     if(!req.headers["apikey"]){
//         return res.status(401).send("User not authenticated")
//     }
//     next();
// })

app.get("/",(req,res)=>{
    res.send("Connected...& App working");
})

app.post("/user/create",(req,res)=>{
    fs.readFile("./db.json",{ encoding: "utf-8" },(err,data)=>{
        const parsed = JSON.parse(data);
        parsed.users=[...parsed.users,req.body];

        fs.writeFile("./db.json",JSON.stringify(parsed),"utf-8",()=>{
            res.status(201).end(`user created ${req.body.id}`);
        });
    });
});

app.post("/user/login",(req,res)=>{

    if(req.body.username == undefined && req.body.password == undefined)
    {
       return res.status(400).send("please provide username and password");
    }
    else
    {
        fs.readFile("./db.json",{ encoding: "utf-8" },(err,data)=>{
            const username=req.body.username;
            const password=req.body.password;
            const parsed = JSON.parse(data);
            if(!parsed.users.find((el)=> el.username !== username))
            {
                if(!parsed.users.find((el)=> el.password !== password))
                {
                    return res.status(401).send("Invalid Credentials");
                }
            }
            else
            {
                return res.send("Login Successful");
            }
        });
    }
});


app.get("/votes/party/:party",(req,res)=>{
    const {party}=req.params;
    console.log(party);
    fs.readFile("./db.json",{ encoding: "utf-8" },(err,data)=>{
        const parsed = JSON.parse(data);
        parsed.users=parsed.users.find((el)=> el.party !== party)
        res.end(parsed.users); 
});
});

app.get("/votes/voters",(req,res)=>{
    fs.readFile("./db.json",{ encoding: "utf-8" },(err,data)=>{
        const parsed = JSON.parse(data);
        parsed.users=parsed.users.find((el)=> el.role !== "vouters")
        res.end(parsed.users);     
});
});

app.put("/votes/vote/:user", function(req, res) {
    var {user} = req.body.name;
        fs.readFile("./db.json",{ encoding: "utf-8" },(err,data)=>{
            const parsed = JSON.parse(data);
            parsed.users=[...parsed.users,(req.body.vote)+1];

            fs.writeFile("./db.json",JSON.stringify(parsed),"utf-8",()=>{
                res.status(201).end(`user created ${req.body.id}`);
            });
  });
});

app.put("/votes/count/:user", function(req, res) {
    var {user} = req.body.user;
    if (user) {
    //   edituser(req.body.todo.id, req.body.todo);
    //   res.send("ok");
    } else {
      res.status(400).send("can't found user");
    }
  });

app.get("/db",(req,res)=>{
    const readStream = fs.createReadStream("./db.json");
    readStream.pipe(res);
})

const PORT = process.env.PORT || 8080
app.listen(PORT);

