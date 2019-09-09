import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GoogleLogin from 'react-google-login';

// import Users from "./Users";
// import FetchTest from "./FetchTest";
// import Login from "./Login";

// <Route exact path="/" component={FetchTest} />
// <Route exact path="/login" component={Login} />
// <Route exact path="/users" component={Users} />


const responseGoogle = (response) => {
  console.log(response);
}

function App() {
  return (
    <Router>
      <div className="App container">
        <Header />
        <h4>Ed Tech Student Advising</h4>
        <GoogleLogin
          clientId="743074626096-h1es8cpfglegj8cfoe41m6d2aornksqs.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </Router>
  );
}

function Header(props) {
  return (
    <header>
      <TopNav />
    </header>
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
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default App;
