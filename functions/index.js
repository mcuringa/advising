const functions = require('firebase-functions');
const app = require("./app.js");
// const auth = require("./auth.js");


exports.app = functions.https.onRequest(app);
// exports.createuser = functions.auth.user().onCreate(auth.createClaims);
