import React from "react";
import net from "../net.js";
import PageSpinner from "../ui/PageSpinner";
import "firebase/auth";
import fb from "../firebase-tools.js";



const firebase = fb.getFirebase();


class Authenticate extends React.Component {



  render() {
    let provider = new firebase.auth.GoogleAuthProvider();

    const auth = ()=> {
      firebase.auth().signInWithRedirect(provider);
    }

    if(this.props.user) {
      return null;
    }
    return (
      <div>
        <button onClick={auth} className="btn btn-primary">sign in</button>
      </div>
    );
  }
}

class LookupUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        loading: true
    };

  }

  componentDidMount() {
    console.log("looking up user after sign-in")
    const store = (data)=>  {
      fb.refreshAuthToken().then(()=>{this.setState( {loading: false });});

    }
    net.get("/api/authorize").then(store);
  }


  render() {
    if (this.state.loading) {
      return (
        <PageSpinner msg="completing sign-in" loading />
      )
    }
    return "/home"
  }
}




export default Authenticate;
export {LookupUser};
