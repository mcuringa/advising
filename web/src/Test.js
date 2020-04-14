import React from "react";

import net from "./net.js";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "waiting"
    };

  }

  componentDidMount() {
    const store = (r)=>  {
      console.log("test results", r);
      this.setState({status: r.status});
    }
    const test = "/api/test";
    net.get(test).then(store);
  }

  render() {
    return (
      <div>
        Test: {this.state.status}
      </div>
    )
  }

}

export default Test;
