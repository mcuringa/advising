const db = require("./db.js");
const admin =  require('firebase-admin');

admin.initializeApp();

const adminEmails = ["mcuringa@adelphi.edu", "hung@adelphi.edu"];

const authRequest = async (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  console.log("--------------- headers ------------------")
  console.log(req.headers);
  console.log();

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
  }
  else if(req.cookies) {
    console.log('Found "__session" cookie');
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
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    console.log("saved user to express (email):", req.user.email);
    console.log("claims:", req.user.claims);
    if(!adminEmails.includes(req.user.email)) {
      res.status(403).send('Unauthorized: admin rights required');
      return;
    }

    next();
    return;
  }
  catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

exports.authRequest = authRequest;
