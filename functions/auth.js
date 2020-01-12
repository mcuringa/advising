const db = require("./db.js");
const admin =  require('firebase-admin');

admin.initializeApp();

const authRequest = async (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

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
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(401).send("You must sign-in before accessing this content.");
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    console.log("saved user to express (email):", req.user.email);
    console.log("claims:", req.user.claims);
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

/**
 * create a user in the mongo database
 * that has the firebase auth user and student/adelphi info
 * admin users are hardcoded in this function
 * add custom claims to the auth user so they can be tokenized
 * via JWT
 */
const createUserFromFirebaseAuth = (fbUser)=> {
  console.log("======================== creating a new user ========================");
  console.log(fbUser);

  const adminUsers = ["mcuringa@adelphi.edu", "hung@adelphi.edu"];

  const email = fbUser.email;
  if(!email.endsWith("adelphi.edu")) {
    return false;
  }
  let user = fbUser;

  const claim = (claims)=> {
    admin.auth().createCustomToken(fbUser.uid, claims)
      .catch((error)=> {
        console.log('Error creating custom token:', error);
      });
  }

  const createFromStudent = (student)=> {
    console.log("creating from student lookup");
    student = student || {};
    user.first =  student.first || "";
    user.last = student.last || "";
    user.student_id = student.student_id || "";
    user.admin = adminUsers.includes(email);
    claim({admin: user.admin, student_id:user.student_id});
    db.save("users", user);
  }

  db.findOne("students", {email: email}).then(createFromStudent)
    .catch((e)=>{console.log("failed to find student", e)});
}



exports.createUser = createUserFromFirebaseAuth;
exports.authRequest = authRequest;
