const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// Connect MongoBD

// Dotenv Config
require("dotenv").config();

// Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simple-node-mongo.gm35wt9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Create Collections

const taskCollection = client.db("task-app").collection("tasks");

// Post API to add Task
app.post("/add-task", async (req, res) => {
  const task = req.body;
  const result = await taskCollection.insertOne(task);
  res.send(result);
});

// Get API to Load all Task
app.get("/my-task", async (req, res) => {
  const query = {};
  const cursor = taskCollection.find(query);
  const tasks = await cursor.toArray();
  res.send(tasks);
});

// First get API for home route

app.get("/", (req, res) => {
  res.send("Task App Server is Runnig");
});

// Get user specific tasks
app.get("/my-tasks", async (req, res) => {
  let query = {};
  if (req.query.user_email) {
    query = {
      user_email: req.query.user_email,
    };
  }
  const cursor = taskCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

// Delete Task using ID
app.delete("/task/:id", async (req, res) => {
  const id = req.params.id;
  let query = { _id: ObjectId(id) };
  const result = await taskCollection.deleteOne(query);
  res.send(result);
});

// Listen API for Port

app.listen(port, () => {
  console.log(`Task App is Runnig on Port : ${port}`);
});
