const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = 3000;

app.use(cors())
app.use(express.json());



const uri = process.env.MONGO_URI;



const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
   
    await client.connect();
    const dbname=process.env.DB_NAME;
    
    const db=client.db(dbname);



    const noticecollection= db.collection("Notices");
    const usercollection= db.collection("users")
    const assignmentcollection=db.collection("assignment")
    const routinecollection=db.collection("routine")



    const noticerouter=require("./Router/Notice/Notices")
    const registerrouter=require("./Router/authentication/Register")
    const loginuserrouter=require("./Router/Users/Loginuser")
    const uploadnoticerouter=require("./Router/Notice/Uploadnotice")
    const uploadassignmentrouter=require("./Router/Assignment/Uploadassignment")
    const uploadroutinerouter=require("./Router/Routine/Uploadroutine")
    const assignemntrouter=require("./Router/Assignment/assignment")
    


// app.get("/loginuser",async(req,res)=>{
//   res.json({ message: "This route is protected",token:req.token})
// })


    app.use("/notice",noticerouter(noticecollection))
    app.use("/register",registerrouter(usercollection))
    app.use("/loginuser",loginuserrouter(usercollection))
    app.use("/upload-notice",uploadnoticerouter(noticecollection))
    app.use("/upload-assignment",uploadassignmentrouter(assignmentcollection))
    app.use("/upload-routine",uploadassignmentrouter(routinecollection))
    app.use("/assignment",assignemntrouter(assignmentcollection,usercollection))








    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


