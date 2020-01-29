import React from "react";
import _ from "lodash";
import * as firebaseui from "firebaseui";
import "firebase/auth";
import fb from "../firebase-tools.js";
const firebase = fb.getFirebase();


class Authenticate extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const uiConfig = {
      signInSuccessUrl: "/",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      immediateFederatedRedirect: false,
      tosUrl: "/privacy",
      signInFlow: 'popup',
      privacyPolicyUrl: "/privacy"
    };

    // firebase.auth().onAuthStateChanged(this.props.watchUser)
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
  }


  render() {
    if(this.props.user) {
      return null;
    }
    return (<div id="firebaseui-auth-container"></div>);
  }
}


export default Authenticate;
