const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 2025;

// middleware
app.use(
  cors({
    origin: "https://ird-foundation-eight.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const db = client.db("irdFoundation");
    const question = db.collection("cat");

    // POST
    app.post("/api/add-dua", async (req, res) => {
      try {
        const data = req.body;
        await client.connect();
        const result = await question.insertOne(data);
        res.status(201).json({ message: "Dua added successfully", result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred", error });
      } finally {
        await client.close();
      }
    });
    // GET

    app.get("/api/get-dua", async (req, res) => {
      const result = await question.find().toArray();
      res.send(result);
    });
    // Root
    app.get("/", (req, res) => {
      const serverStatus = {
        message: "Server is running smoothly",
        timestamp: new Date(),
      };
      res.json(serverStatus);
    });

    app.listen(port, () => {
      console.log("run");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
