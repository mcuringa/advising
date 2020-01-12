const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = process.env.dbURL;
const store = process.env.store;

let client = null;
async function connect(collection) {

  // console.log("----------------------------------\n\n");
  // console.log("url", url);
  // console.log("\n\n----------------------------------");


  const client = new MongoClient(url, { useNewUrlParser: true });
  // console.log("got client...", client);

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

async function findAll(collection) {
  return find(collection, {});
}

async function find(collection, query) {

  const p = (resolve, reject)=> {
    // console.log("finding...", query);
    const search = (col)=> {
      // console.log("collection:", col);
      let data = col.find(query).toArray();
      // console.log("got data", data);
      data.then(resolve);
    }

    connect(collection).then(search, reject);
  }

  return new Promise(p);
}

async function get(collection, id) {
  // console.log("getting object:", id);
  id = ObjectId(id);
  // console.log("objectid:", id);
  const col = await connect(collection);
  return col.findOne({ _id: id });
}


async function save(collection, obj) {
  const col = await connect(collection);
  if (obj._id) {
    return col.updateOne(obj);
  }
  return col.insertOne(obj);
}

async function createAll(collection, data) {
  const col = await connect(collection);
  return col.insertMany(obj);
}



module.exports = {
  get: get,
  connect: connect,
  findAll: findAll,
  find: find,
  save: save
};
