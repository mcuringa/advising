import React from "react";
import "./Toggle.css";
import moment from "moment";

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posted: new Date();
    }
  }

  render() {
    if (!msg || msg.length === 0) {
      return null;
    }
    // const css = "d-flex align-items-center";
    const css = "Toggle" + this.props.css;
    return (
      <div role="alert" aria-live="assertive" aria-atomic="true" className="toast" data-autohide="false">
        <div className="toast-header">
          <img src="..." className="rounded mr-2" alt="...">
          <strong className="mr-auto">Bootstrap</strong>
          <small>11 mins ago</small>
          <button type="button" onClick={props.close} className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="toast-body">{props.msg}</div>
      </div>
    )

  }
}
