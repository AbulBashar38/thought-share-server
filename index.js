require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vpo7dz0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const thoughtCollection = client.db("thought-share").collection("thoughts");
    app.get("/thoughts", async (req, res) => {
      const cursor = thoughtCollection.find({});
      const thoughts = await cursor.toArray();

      res.send({ status: true, data: thoughts });
    });

    app.post("/thought", async (req, res) => {
      const thought = req.body.thought;
      const result = await thoughtCollection.insertOne(thought);
      res.send(result);
    });

    app.delete("/thought/:id", async (req, res) => {
      const id = req.params.id;

      const result = await thoughtCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    app.put("/updateThought/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const thought = req.body;
      const updateDocument = { $set: { ...thought } };
      const result = await thoughtCollection.updateOne(filter, updateDocument);
      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! hi");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
