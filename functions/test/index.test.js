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

  describe("get", ()=> {
    it("should get a record based on _id", async ()=> {
      const name = "Xiaheinuer";
      let id = new ObjectId("5e2cb737cb989118ba1cc0e6");
      const user = await db.get("students", id);
      user.last.should.equal(name);
    });
  });


  describe('update', ()=> {
    it('should update existing test record', async ()=> {
      const name = "Shahee (Ahati)";
      let id = new ObjectId("5e2cb737cb989118ba1cc0e6");
      let student = {
        _id: "5e2cb737cb989118ba1cc0e6",
        student_id: '1775424',
        first: 'Shahee',
        last: 'Xiaheinuer',
        graduated: false,
        maj1: 'EDX',
        aui: false,
        email: 'ahatixiaheinuer@mail.adelphi.edu',
        last_registered: '19/02',
        online: false,
        active: true,
        modified: '2020-01-31T03:09:17.173Z'
      };
      student.first = name;
      const result = await db.save("students", student);
      const user = await db.get("students", id);
      console.log("students", user)
      user.first.should.equal(name);
      result.should.exist;
    });
  });



});
