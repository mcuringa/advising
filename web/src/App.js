import React from "react";
import { BrowserRouter as Router, Route, Link, NavLink, Switch } from "react-router-dom";
import PageScreen from "./pages";
import Authenticate from "./users/Auth.js";
import CourseScreen from "./CourseList";
import CourseForm from "./CourseForm";
import ScheduleScreen from "./Schedule";
import StudentsScreen from "./StudentList";
import StudentDetail from "./StudentDetail";

import fb from "./firebase-tools.js";

import "./App.css";

import logo from "./res/logo.png";
import letters from "./res/letters.png";


function App() {
  return (
    <Router>
      <div className="App">
        <SecureRoutes />
        <Route exact path="/privacy"
          render={(props) => <PageScreen {...props} page="privacy" />}/>
      </div>
    </Router>
  );
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
        <div className="container">
          <Switch>
            <PropsRoute exact path="/" component={Home} />
            <PropsRoute path="/sign-in" component={SignIn} />
            <PropsRoute path="/login" component={Authenticate} />
            <PropsRoute exact path="/scheduling" component={ScheduleScreen} />
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

const SignIn = (props) => {
  console.log("user:", props.user);
  if(!props.user && !props.user.email) {
    return "loading...";
  }
  return "signed in";
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
      <p className="container text-white p-2">
        The graduate program in Educational Technology at Adelphi University.
      </p>
    </footer>
  )
}


function SubNav (props) {

  return (
    <div className="SubNav d-flex bg-white">
      <Switch>
        <Route path="/courses">
          <Link className="nav-link pt-0 pb-0 text-brown" to="/courses">list</Link>
          <Link className="nav-link pt-0 pb-0 text-brown" to="/scheduling">scheduling</Link>
          <Link className="nav-link pt-0 pb-0 text-brown" to="/courses/new">new</Link>

        </Route>
        <Route path="/students">
          <NavLink className="nav-link pt-0 pb-0 text-brown" to="/students">list</NavLink>
          <NavLink className="nav-link pt-0 pb-0 text-brown" to="/students/new">new</NavLink>
        </Route>
      </Switch>
    </div>
  )
}

function TopNav (props) {
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
            <li className="nav-item mb-0 pb-0">
              <NavLink activeClassName="active bg-white border-white disabled" className="nav-link text-brown pt-1 mb-0 pb-0" to="/courses">Courses</NavLink>
            </li>
            <li className="nav-item mb-0 pb-0">
              <NavLink activeClassName="active bg-white border-white disabled" className="nav-link text-brown pt-1 mb-0 pb-0" to="/students">Students</NavLink>
            </li>
            <li className="nav-item mb-0 pb-0">
              <NavLink activeClassName="active bg-white border-white disabled" className="nav-link text-brown pt-1 mb-0 pb-0" to="/privacy">Privacy</NavLink>
            </li>
            <li className="nav-item mb-0 pb-0">
              <button className="btn nav-link btn-link text-brown pt-1 mb-0 pb-0" onClick={fb.signOut}>Sign out</button>
            </li>
          </ul>
        </div>
        <SubNav />
      </div>
    </nav>
  )
}

export default App;
