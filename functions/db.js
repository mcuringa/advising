const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const _ = require("lodash");
const moment = require("moment");

const config = require("./config.json");
const url = config.dbURL;
const store = config.store;
let client = null;

async function connect(collection) {
  //
  // console.log("----------------------------------\n\n");
  // console.log("url", url);
  // console.log("\n\n----------------------------------");

  // if (!client) {
    client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  // }
  // else {
  //   console.log("using cached client");
  // }

  let p = (resolve, reject) => {
    // console.log("connecting...");
    client.connect().then(() => {
      // console.log("connected...");
      let col = client.db(store).collection(collection);
      resolve(col);
    }).catch(resolve);
  }

  return new Promise(p);
}

function cleanTypes(d) {
    const keys = _.keys(d);
    // console.log("keys", keys);
    let o2 = {};
    for(let key of keys) {
      let v = d[k];
      let n = Number(v);
      if(!Number.isNaN(n)) {
        v = n;
      }
      else if(moment(v, moment.ISO_8601, true).isValid()) {
        v = new Date(v);
      }
      o2[k] = v
    }

    return o2;
}


async function findAll(collection) {
  return find(collection, {});
}

async function find(collection, query) {

  const p = (resolve, reject)=> {
    // console.log("finding...", query);
    const search = (col)=> {
      // console.log("collection:", col);
      let data = col.find(query).toArray();
      // data = _.map(data, cleanTypes);
      // console.log("got data", data);
      data.then(resolve);
    }

    connect(collection).then(search, reject);
  }

  return new Promise(p);
}


async function get(collection, id) {
  id = new ObjectId(id);
  return findOne(collection, { _id: id });
}

async function findOne(collection, query) {
  // console.log("finding one for query:", query);
  const p = (resolve, reject)=> {
    // console.log("finding...", query);
    const search = (col)=> {
      // console.log("collection:", col);
      let data = col.findOne(query);
      // console.log("got data", data);
      data.then(resolve);
    }

    connect(collection).then(search, reject);
  }

  return new Promise(p);
}


async function save(collection, obj) {

  const col = await connect(collection);
  obj.modified = new Date();
  if (obj._id) {
    obj._id = new ObjectId(obj._id);
    return col.replaceOne({_id: obj._id}, obj);
  }
  else {
    obj.created = new Date();
  }
  return col.insertOne(obj);
}

async function saveAll(collection, data) {
  const col = await connect(collection);
  const bulk = col.initializeUnorderedBulkOp();

  for(let d of data) {
    d.modifed = new Date();
    if(!d._id) {
      d.created = new Date();
      bulk.insert(d);
    }
    else {
      bulk.find({_id: d._id}).replaceOne(d);
    }
  }
  return bulk.execute();
}

async function drop(collection) {
  const col = await connect(collection);

  return col.drop().catch(  (e)=> {
    if(e.code === 26) {
      console.log("could not drop ",collection,"does not exist.");
    }
    else {
      throw e;
    }
  });
}



function close() {
  if(client) {
    try {
      client.close();
      console.log("client closed");
    }
    catch(e) {
      // we tried
      console.log("couldn't close client", e);
    }
  }
}

module.exports = {
  get: get,
  connect: connect,
  close: close,
  drop: drop,
  find: find,
  findAll: findAll,
  findOne: findOne,
  find: find,
  save: save,
  saveAll: saveAll
};
