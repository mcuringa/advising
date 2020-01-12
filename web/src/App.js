import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PageScreen from "./pages";
import Authenticate from "./users/Auth.js";
import CourseScreen, { CoursePage } from "./courses";
import StudentsScreen, { StudentPage } from "./students";

import fb from "./firebase-tools.js";



function App() {
  return (
    <Router>
      <div className="App container">
        <h1>Foo Bar</h1>
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
    console.log("================== SECURE ROUTES =====================");
    console.log("props", this.props);
    // console.log("user:", this.state.user);
    if(!this.state.user) {
      return <Authenticate />
    }

    return (
      <div className="SecureRoutes">
        <Header  />
        <PropsRoute foo="bar" exact path="/" component={Home} />
        <PropsRoute path="/sign-in" component={SignIn} />
        <PropsRoute path="/login" component={Authenticate} />
        <PropsRoute exact path="/courses" component={CourseScreen} />
        <PropsRoute path="/courses/:id" component={CoursePage} />
        <PropsRoute exact path="/students" component={StudentsScreen} />
        <PropsRoute path="/students/:id" component={StudentPage} />
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
        <li>foo: {this.props.foo}</li>
        <li>displayName: {user.displayName}</li>
        <li>email: {user.email}</li>
      </ul>
    )

  }

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
            <Link className="nav-link" to="/courses">Courses</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/students">Students</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/privacy">Privacy</Link>
          </li>
          <li className="nav-item">
            <button className="btn nav-link" onClick={fb.signOut}>Sign out</button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default App;
