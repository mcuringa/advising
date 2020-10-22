import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./config.json";

let _firebase = null;
let _user = null;

const updateUser = (u)=> {
  if(_user && !u) { //signing out
    localStorage.removeItem("jwt");
  }
  else if(u) {

    const saveToken = (token)=> {
      // console.log("saving jwt...", token);
      localStorage.setItem("jwt", token)
    };
    u.getIdToken(true).then(saveToken);
  }
  _user = u;
}

const getFirebase = ()=> {
  if(_firebase) {
    return _firebase;
  }


  firebase.initializeApp(firebaseConfig);
  _firebase = firebase;
  return _firebase;
}


const signOut = ()=> {
  const fb = getFirebase();
  fb.auth().signOut().then(()=>{
    _user = null;
    updateUser(null);
  });
}

const refreshAuthToken = ()=> {
  const refresh = (resolve, reject)=> {
    if (!_user) {
      reject(_user);
    }

    _user.getIdToken(true)

    resolve(_user);

  }

  return new Promise(refresh);
}

const getAuthUser = (watch)=> {
  const auth = (resolve, reject)=> {
    if(!_user) {
      const fb = getFirebase();
      _user = fb.auth().currentUser;
      fb.auth().onAuthStateChanged(updateUser);
      fb.auth().onAuthStateChanged(watch);
    }
    resolve(_user);
  }

  return new Promise(auth);
}

const fb = {
  getAuthUser: getAuthUser,
  refreshAuthToken: refreshAuthToken,
  signOut: signOut,
  getFirebase: getFirebase
};

export default fb;
