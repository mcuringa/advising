import * as firebase from "firebase/app";
import "firebase/auth";


let _firebase = null;
let _user = null;
const updateUser = (u)=> {
  if(_user && !u) { //signing out
    localStorage.removeItem("jwt");
  }
  else if(u) {
    const saveToken = (token)=> {localStorage.setItem("jwt", token)};
    u.getIdToken(true).then(saveToken);
  }
  _user = u;
}

const getFirebase = ()=> {
  if(_firebase) {
    return _firebase;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyCdUPov4Jm28ruthqILDHsOKnBv3SMRh_I",
    authDomain: "ed-tech-portal.firebaseapp.com",
    databaseURL: "https://ed-tech-portal.firebaseio.com",
    projectId: "ed-tech-portal",
    storageBucket: "ed-tech-portal.appspot.com",
    messagingSenderId: "1022403549610",
    appId: "1:1022403549610:web:57a0111e459fab057bf3d3"
  };
  firebase.initializeApp(firebaseConfig);
  _firebase = firebase;
  return _firebase;
}


const signOut = ()=> {
  const fb = getFirebase();
  fb.auth().signOut().then(()=>{
    updateUser(null);
  });
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
  signOut: signOut,
  getFirebase: getFirebase
};

export default fb;
