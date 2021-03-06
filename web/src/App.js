import React from "react";
import { BrowserRouter as Router, Route, Link, NavLink, Switch } from "react-router-dom";
import PageScreen from "./pages";
import Authenticate, {LookupUser} from "./users/Auth.js";
import CourseScreen from "./CourseList";
import CourseForm from "./CourseForm";
import ScheduleScreen from "./Schedule";
import StudentsScreen from "./StudentList";
import StudentDetail from "./StudentDetail";
import Test from "./Test";
import SecurityError from "./net";
import classNames from "classnames";


import fb from "./firebase-tools.js";
// import net from "./net.js";

import "./App.css";

import logo from "./res/logo.svg";
import letters from "./res/letters.png";


function App() {
  try {
    return (
      <Router>
        <div className="App">
          <SecureRoutes />
          <Route exact path="/privacy" render={(props) => <PageScreen page="privacy" />}/>
          <Route exact path="/test"render={(props) => <Test />}/>
        </div>
      </Router>
    );
  }
  catch (e) {
    console.log("caught error in app:", e);
    if (e instanceof SecurityError) {
      return (<PageScreen page="security" />)
    } else {
      throw e;
    }
  }

}

class SecureRoutes  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {

    const watchUser = (user)=> {
      // net.get("/api/authenticate").then((u)=>{this.setState({user: u});});
      this.setState({user: user});
    }
    fb.getAuthUser(watchUser).then((u)=>{this.setState({user:u})});
  }

  render() {
    // console.log("================== SECURE ROUTES =====================");
    // console.log("props", this.props);
    // console.log("user:", this.state.user);
    if(!this.state.user) {
      return (
        <div>
          <Header  />
          <Authenticate />
          <Footer />
        </div>
      )
    }

    return (
      <div className="SecureRoutes">
        <Header  />
        <div className="container-fluid">
          <Switch>
            <PropsRoute exact path="/" component={Home} />
            <PropsRoute path="/sign-in" component={LookupUser} />
            <PropsRoute path="/login" component={Authenticate} />
            <PropsRoute exact path="/courses/scheduling" component={ScheduleScreen} />
            <PropsRoute exact path="/courses" component={CourseScreen} />
            <PropsRoute exact path="/courses/new" component={CourseForm} />
            <PropsRoute path="/courses/:id" component={CourseForm} />
            <PropsRoute exact path="/students" component={StudentsScreen} />
            <PropsRoute exact path="/students/new" component={StudentDetail} />
            <PropsRoute path="/students/:id" component={StudentDetail} />
          </Switch>
        </div>
        <Footer />
      </div>
    )
  }
}


/**
 * wrap up react-router props with other pass-through props
 */
const PropsRoute = ({ component, ...props })  => {
  const wrap = (...routerProps)=> {
    const allProps = Object.assign(...routerProps, props);
    return React.createElement(component, allProps);
  };

  return <Route {...props} render={wrap} />;
}


class Home  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const watchUser = (user)=> {
      this.setState({user: user});
    }
    fb.getAuthUser(watchUser).then((u)=>{this.setState({user:u})});
  }

  render() {
    // console.log("home props:", this.props);
    const user = this.state.user || {};
    return (
      <ul>
        <li>displayName: {user.displayName}</li>
        <li>email: {user.email}</li>
      </ul>
    )

  }

}


function Header(props) {
  return (
    <header className="MainHeader bg-gold">
      <TopNav />
    </header>
  )
}

function Footer (props) {
  return (
    <footer className="MainFooter border bg-brown mb-0 mt-2 fixed-bottom">
      <p className="container-fluid text-white p-2">
        The graduate program in Educational Technology at Adelphi University.
      </p>
    </footer>
  )
}



function TopNav (props) {
  const navcss = "nav-link text-brown pt-1 mb-0 pb-0"
  return (
    <nav className="navbar navbar-expand-md container navbar-light">
      <Link to="/" className="navbar-brand">
        <img className="d-none d-md-block" src={logo} alt="adelphi logo" />
        <img className="d-md-none " src={letters} alt="adelphi lettermark" />
      </Link>

      <button className="navbar-toggler"
        type="button" data-toggle="collapse"
        data-target="#TopMenu" aria-controls="TopMenu" aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>


      <div>
        <div id="TopMenu" className="collapse navbar-collapse m-0 p-0">
          <ul className="TopNav navbar-nav m-0 p-0">
            <li className="nav-item dropdown mb-0 pb-0">
              <button className="nav-link dropdown-toggle text-brown btn btn-link font-weight-bold" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Courses</button>
              <div className="dropdown-menu">
                <NavLink key="list" className="nav-link pt-0 pb-0 text-brown" to="/courses">list courses</NavLink>
                <NavLink key="sched" className="nav-link pt-0 pb-0 text-brown" to="/courses/scheduling">course scheduling</NavLink>
                <NavLink key="new" className="nav-link pt-0 pb-0 text-brown" to="/courses/new">create course</NavLink>
              </div>
            </li>
            <li className="nav-item dropdown mb-0 pb-0">
              <button className="nav-link dropdown-toggle text-brown btn btn-link font-weight-bold" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Students</button>
              <div className="dropdown-menu">
                <NavLink className="nav-link pt-0 pb-0 text-brown" to="/students">list students</NavLink>
                <NavLink className="nav-link pt-0 pb-0 text-brown" to="/students/new">add student</NavLink>
              </div>
            </li>
            <li className="nav-item mb-0 pb-0">
              <NavLink activeClassName="active bg-white disabled" className="nav-link text-brown btn btn-link font-weight-bold" to="/privacy">Privacy</NavLink>
            </li>
            <li className="nav-item mb-0 pb-0">
              <button className="btn nav-link btn-link text-brown font-weight-bold" onClick={fb.signOut}>Sign out</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default App;
