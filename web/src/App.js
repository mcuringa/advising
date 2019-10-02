import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import _ from "lodash";
import net from "./net";
import PageScreen from "./pages";
import CourseScreen, { CourseListScreen } from "./courses";
import StudentScreen from "./students";


const googleClientId ='743074626096-7ead9s7ltunfmc90fodd024r2uct0g1q.apps.googleusercontent.com';
const googleAPIKey = "AIzaSyBDFhZE_qr85vhCw3b6m7AJM0zYAF7mzzY";



const googleListener = (x) => {
  console.log("auth update:", x);
}

function App() {
  return (
    <Router>
      <div className="App container">
        <Header />
        <Authorized />

        <Route exact path="/auth" component={HandleGoogleAuth} />
        <Route exact path="/courses" component={CourseScreen} />
        <Route path="/courses/:id" component={CourseScreen} />
        <Route exact path="/students" component={StudentScreen} />
        <Route exact path="/privacy"
               render={(props) => <PageScreen {...props} page="privacy" />}/>
      </div>
    </Router>
  );
}


const HandleGoogleAuth = (props) => {
  const hash = window.location.hash;
  console.log("hash:", hash);
  const params = hash.split("&");
  console.log("params:", params);

  let responseHeaders = {};
  const addHeader = (pair)=> {
    let p = pair.split("=");
    let key = decodeURI(p[0]);
    let val = decodeURI(p[1]);
    responseHeaders[key] = val;
  }

  _.each(params, addHeader);
  console.log("response headers:", responseHeaders);
  const token = responseHeaders["access_token"];
  const url = "https://www.googleapis.com/auth/userinfo.profile?access_token=" + token;


  net.get(url).then((p)=>{console.log("got profile: ", p)}).catch((e)=>{console.log("error with profile:", e)});

  return (<p>Thank you for logging in.</p>)
}

// http://localhost:3000/auth#state=pass-through%20value&access_token=ya29.GluIB3IoqhmrAw_OjHPaHBeA_IWtmpZUlJ2pWJxwPrrfxxgxAxhMSh_ymD90m83JbUljXL05yg5V19qjXxTm0vAVXaT7drw9g2Wcq23vu19PfA6znnCbeIeThNLq&token_type=Bearer&expires_in=3600&scope=email%20profile%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email%20openid&authuser=0&hd=adelphi.edu&session_state=62e85def5a95c993cc29267dff7bfe4ff8db19bf..bf9f&prompt=consent
const GoogleAuthForm = (props)=>{
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  const authRedirect = "http://localhost:3000/auth";
  return (
    <form method="GET" action={oauth2Endpoint}>
      <input type="hidden" name="client_id" value={googleClientId} />
      <input type="hidden" name="redirect_uri" value={authRedirect} />
      <input type="hidden" name="response_type" value="token" />
      <input type="hidden" name="scope" value="profile email openid" />
      <input type="hidden" name="include_granted_scopes" value="true" />
      <input type="hidden" name="state" value="pass-through value" />
      Adelphi email: <input type="email" name="login_hint" /><br />
      <button type="submit">Log in with Google</button>
    </form>
  );
}

class Authorized extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.loginSuccess = this.loginSuccess.bind(this);
    this.loginFailure = this.loginFailure.bind(this);

  }

  loginSuccess(u) {
    console.log("login worked", u);
  }

  loginFailure(u) {

    console.log("login failed", u);
  }

  render() {

    if(!this.state.user) {

      return ( <GoogleAuthForm /> );
    }
    else {
      return (<p>authorized</p>)
    }
  }
}

function Header(props) {
  return (
    <header>
      <TopNav />
    </header>
  )
}

function Students(props) {
  return (
    <div>
      This will show a list of all of the students, with checkboxes
      to filter on: active, graduated, AUI, AllCampus, etc...

    </div>
  )
}


function TopNav(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/courses">Courses</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/students">Students</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/privacy">Privacy</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default App;
