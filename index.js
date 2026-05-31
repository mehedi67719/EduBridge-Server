const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 3000;


const uri = "mongodb+srv://Edubridge:dHJeEJztWLgKNsP4@cluster0.jc6c5mw.mongodb.net/?appName=Cluster0";



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
    
    const db=client.db("Edubridge");



    const noticecollection=await db.collection("Notices");



    const noticerouter=require("./Router/Notices")





    app.use("/notice",noticerouter(noticecollection))







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


