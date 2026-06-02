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



    const noticerouter=require("./Router/Notices")
    const loginrouter=require("./Router/authentication/Login")
    const registerrouter=require("./Router/authentication/Register")





    app.use("/notice",noticerouter(noticecollection))
    app.use("/login",loginrouter(usercollection))
    app.use("/register",registerrouter(usercollection))







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


