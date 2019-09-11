import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleLogin from 'react-google-login';
import PageScreen from "./pages";




const responseGoogle = (response) => {
  console.log(response);
}

function App() {
  return (
    <Router>
      <div className="App container">
        <Header />
        <Authorized />

        <Route exact path="/students" component={Students} />
        <Route exact path="/privacy"
               render={(props) => <PageScreen {...props} page="privacy" />}/>
      </div>
    </Router>
  );
}


function Login(props) {
  return (
    <GoogleLogin
      clientId="743074626096-h1es8cpfglegj8cfoe41m6d2aornksqs.apps.googleusercontent.com"
      buttonText="Login"
      onSuccess={props.success}
      onFailure={props.failure}
      cookiePolicy={'single_host_origin'}
    />
  )
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
    console.log("login worked", u);
  }

  render() {
    if(!this.state.user) {
      return <Login success={this.loginSuccess} failure={this.loginFailure} />
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
    <div>This is students</div>
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
