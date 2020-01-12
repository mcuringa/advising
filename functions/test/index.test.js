const test = require('firebase-functions-test')();
const assert = require('assert');
const db = require('../db');
const config = require("../config.json");
describe('config', ()=> {
  describe('store', ()=> {
    it('should be "advising"', ()=> {
      assert.equal(config.store, "advising");
    });
  });
});


describe('db', ()=> {
  describe('findAll', ()=> {
    it('should return an array of students', ()=> {
      const check = (data)=> {
        console.log(data[0]);
        assert(data.length, "should find more than 1 student");
        assert(data[0].first, "first student should have a name");
      }
      db.find("students", {}).then(check);
    });
  });
});
