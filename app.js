require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

// const cors = require('cors');
// const auth = require("./auth.js");


const db = require("./db.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(cors());

// basic REST functions
// =========================

const restList = async (req, res) => {
  console.log("rest listparams:", req.params);
  console.log("rest query string:", req.query);
  let data = await db.find(req.params.collection, req.query);
  // let data = await db.findAll(req.params.collection);
  res.json(data);
}

const restGet = async (req, res) => {
  console.log("rest get params:", req.params);
  let data = await db.get(req.params.collection, req.params.id);
  res.json(data);
}

const postObject = async (req, res, next, resolve) => {

  const data = req.body;
  const col = req.params.collection;
  console.log("data:", data);
  db.save(col, data).then(resolve, next);

}

const restPost = async (req, res, next) => {
  const go = (obj)=> {
    res.status(201).json({
      "msg": "data created",
      "data": obj
    });
  }
  postObject(req, res, next, go);
}

const restPut = async (req, res, next) => {
  const go = (obj)=> {
    res.json({
      "msg": "data updated",
      "data": obj
    });
  }
  postObject(req, res, next, go);
}


// =========================================== testing
const dataTest = (req, res) => {
  console.log("rest get params:", req.params);
  let data = [{msg: "Hello, world."}, {msg: "foo"}];
  res.json(data);
}
app.get('/api/test', dataTest);

// =========================================== routes

// auth routes
// app.post("/api/users", auth.createUser);
// app.post("/api/login", auth.authenticate);

// rest routes
app.get('/api/:collection', restList);
app.get('/api/:collection/:id', restGet);
app.post('/api/:collection', restPost);
app.put('/api/:collection/:id', restPut);
// app.delete('/api/:collection/:id', restDel);


exports.app = app;
