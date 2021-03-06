import React from "react";
import "./Toggle.css";
import _ from "lodash";
import {CaretFillDown, CaretFillRight} from "./icons";


class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }


  render() {

    if (this.props.plain) {
      return <PlainToggle {...this.props} />
    }

    // const css = "d-flex align-items-center";
    const css = "Toggle " + this.props.css;
    const open = _.isUndefined(this.state.open)? this.props.open : this.state.open;
    const show = (open)?"d-block":"d-none";


    const toggle = ()=>{ this.setState({open:!open}); };
    return (
      <div className={css}>
        <div className="ToggleTitle d-flex align-items-center">
          <ToggleIcon open={open} toggle={toggle} />
          {this.props.title}
        </div>
        <div className={`card card-body ${show}`}>{this.props.children}</div>
      </div>
    )

  }
}

class PlainToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }


  render() {
    // const css = "d-flex align-items-center";
    const css = "PlainToggle " + this.props.className;
    const open = _.isUndefined(this.state.open)? this.props.open : this.state.open;
    const show = (open)?"d-block":"d-none";


    const toggle = ()=>{ this.setState({open:!open}); };
    return (
      <div className={css}>
        <div className="PlainToggleTitle d-flex align-items-center">
          <ToggleIcon open={open} toggle={toggle} />
          {this.props.title}
        </div>
        <div className={`${show}`}>{this.props.children}</div>
      </div>
    )

  }
}


function ToggleIcon (props) {
  let open = props.openIcon || <CaretFillDown className="icon-primary" />;
  let closed = props.closedIcon || <CaretFillRight className="icon-primary" /> ;
  let icon = (props.open)?open : closed;

  return <button className="btn btn-link d-block text-decoration-none p-0 pr-2" onClick={props.toggle}>{icon}</button>
}

export default Toggle;
