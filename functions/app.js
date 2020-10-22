const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const auth = require("./auth.js");
const db = require("./db.js");
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// origin: ["https://ed-tech-portal.firebaseapp.com/",'http://localhost:3000']
const corsOptions = {
  origin: ["https://ed-tech-portal.firebaseapp.com/", "http://localhost:3000"]
}

app.use(cors(corsOptions));
// restrict requests to authorized adelphi users
app.use(auth.authRequest);


// not needed anymore?
// const secureAPI = (req, res, next)=> {
//   app.options('/api/:collection', cors());
//   app.options('/api/:collection/:id', cors());
//   next();
// }
//
// app.use(secureAPI);


// basic REST functions
// =========================

const restList = async (req, res, next) => {
  // console.log("rest listparams:", req.params);
  // console.log("rest query string:", req.query);
  let data = await db.find(req.params.collection, req.query);
  // let data = await db.findAll(req.params.collection);
  res.json(data);
  next();
}

const restGet = async (req, res, next) => {
  // console.log("rest get params:", req.params);
  let data = await db.get(req.params.collection, req.params.id);
  res.json(data);
  next();
}

const saveObject = async (req, res, next, resolve) => {

  const data = req.body;
  const col = req.params.collection;
  // console.log("collection:", col);
  // console.log("saving:", data);
  db.save(col, data).then(resolve, next);

}

const restPost = async (req, res, next) => {
  const go = (obj)=> {
    res.status(201).json({
      "msg": "data created",
      "data": obj
    });
  }
  saveObject(req, res, next, go);
}

const restPut = async (req, res, next) => {
  const go = (obj)=> {
    res.json({
      "msg": "data updated",
      "data": obj
    });
  }
  saveObject(req, res, next, go);
}


// =========================================== testing
const dataTest = async (req, res, next) => {
  console.log("rest get params:", req.params);
  // let courses = await db.get("courses");

  let data = [{msg: "Hello, world."}, {"auth user": req.user}];
  res.json(data);
  next();
}

app.get('/api/test', dataTest);

// =========================================== routes

// rest routes
app.get('/api/authorize', auth.authorize);
app.get('/api/:collection', restList);
app.get('/api/:collection/:id', restGet);
app.post('/api/:collection', restPost);
app.put('/api/:collection/:id', restPut);

// app.delete('/api/:collection/:id', restDel);

const clean = (req, res, next)=> {
  // console.log( "closing connections" );
  db.close();
  next();
}

app.use(clean);

module.exports = app;
