const db = require("./db.js");
const admin =  require('firebase-admin');

admin.initializeApp();

// admin users identified by email, authenticate via google api
const adminEmails = ["mcuringa@adelphi.edu", "hung@adelphi.edu"];

/**
 * control access to secure api calls to the express app
 * by checking the JWT Bearer token and examining the custom claims
 * admin users are granted full access to application data
 * for reading and writing. All other users are restricted
 * to calls for their own data, via student_id
 * only white-listed URLs are authorized, all other requests
 * are denied
 */
const authRequest = async (req, res, next) => {
  // console.log('Check if request is authorized with Firebase ID token');
  //
  // console.log("--------------- headers ------------------")
  // console.log(req.headers);
  // console.log();

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  }
  else if(req.cookies) {
    // console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  else {
    // No cookie
    res.status(401).send("You must sign-in before accessing this content.");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    // console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    checkRequest(req, res, next);
    return;
  }
  catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};


const checkRequest = (req, res, next)=> {
  const user = req.user;
  console.log("checking request for", user.email);

  const reqKey = `${req.method}:${req.path}`;
  console.log("reqKey", reqKey);
  const whitelist = [
    "GET:/api/authorize",
    "GET:/api/students/" + req.user.user_id,
    "PUT:/api/students/" + req.user.user_id,
    "GET:/api/plans?student_id=" + req.user.student_id,
    "PUT:/api/plans/" + req.user.plan_id
  ];

  const granted = whitelist.includes(reqKey);

  console.log("whitelist:", granted);
  // check the URL
  // make sure the data object matches their data
  // return 403 if not authorized
  // call next() otherwise
  if(adminEmails.includes(req.user.email) || granted) {
    next();
    return;
  }

  res.status(403).send('Unauthorized: admin rights required');
  return;

}

/**
 * add a custom claim to the user with their au student_id
 * and their mongo user_id (users._id)
 * student_id will be used to restrict access to only
 * that users data for read and write operations.
 */
const authorize = async (req, res, next) => {
  console.log("================================ authorize called =========================================")
  const email = req.user.email;
  console.log("created new firebase user:", email);
  const isAdmin = adminEmails.includes(email);
  const setClaims = (student, plan) => {
    if(!student && !isAdmin) {
      // they get no access, not in db
      return;
    }
    let user_id = (student)?student._id:null;
    let student_id = (student)?student.student_id:null;
    let plan_id = (plan)?plan._id:null;
    const claims = {
      admin: isAdmin,
      user_id: user_id,
      student_id: student_id,
      plan_id: plan_id
    }

    admin.auth().setCustomUserClaims(req.user.uid, claims).then(() => {
      // The new custom claims will propagate to the user's ID token the
      // next time a new one is issued.
      console.log("set custom claims:", claims);
      next();
    });
  }
  let getStudent = db.findOne("students", {"email": email});
  let getPlan = db.findOne("plans", {"email": email});
  Promise.all([getStudent, getPlan]).then(setClaims);

}

exports.authorize = authorize;
exports.authRequest = authRequest;
