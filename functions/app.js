require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const auth = require("./auth.js");


const db = require("./db.js");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: ['http://localhost:3000',]
}
app.use(cors(corsOptions));
// restrict requests to authorized adelphi users
app.use(auth.authRequest);

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


const secureAPI = (req,res,next)=> {
  // res.header("Access-Control-Allow-Origin", "*");
  app.options('/api/:collection', cors());
  app.options('/api/:collection/:id', cors());
  app.options('/api/:collection', cors());
  app.options('/api/:collection/:id', cors());
  next();
}

app.use(secureAPI);

// rest routes
app.get('/api/:collection', restList);
app.get('/api/:collection/:id', restGet);
app.post('/api/:collection', restPost);
app.put('/api/:collection/:id', restPut);

// app.delete('/api/:collection/:id', restDel);

module.exports = app;
