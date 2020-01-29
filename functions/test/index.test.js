const test = require('firebase-functions-test')();
const should = require('should');
const ObjectId = require('mongodb').ObjectId;
const db = require('../db');
const config = require("../config.json");


const testUser = {
  "uid": "okjNhpQnxgQxiAEoi2vmEBAiU8J2",
  "displayName": "Matthew Curinga",
  "photoURL": "https://lh3.googleusercontent.com/a-/AAuE7mA4xXJiREUhtgUEUY6qCIKPz99-6v0DfCYGYzz3uA",
  "email": "mcuringa@adelphi.edu",
  "emailVerified": true,
  "phoneNumber": null
}

const e = (msg)=> {
  return (error)=>{
    console.log(msg);
  }
}

describe('config', ()=> {
  describe('store', ()=> {
    it('should be "advising"', ()=> {
      config.should.have.property('store', 'advising');
    });
  });
});


describe('db', ()=> {
  describe('findAll', ()=> {
    it('should return an array of students', async ()=> {
      const data = await db.find("students", {});
      data.length.should.be.above(0);
      data[0].first.should.exist;
    });
  });

  describe('findOne', ()=> {
    it('should find a single student', async ()=> {
      const student = await db.findOne("students", {first: "Tanja"});
      student.first.should.equal("Tanja");
    });
  });

  describe('create', ()=> {
    it('should create new tests record', async ()=> {
      const result = await db.save("tests", {first: "Tanja"});
      result.should.exist;
    });
  });


  describe('update', ()=> {
    it('should update existing test record', async ()=> {
      let data = { _id: ObjectId("5e251b0585997e5035cacc32"), foo:"baz" };
      const result = await db.save("tests", data);
      result.should.exist;
    });
  });



});
