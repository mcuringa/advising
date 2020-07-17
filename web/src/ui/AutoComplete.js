import React from "react";
import _ from "lodash";

import {
  TextInput
} from "./form-ui";




class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.popId  = _.uniqueId("drop_");
    console.log("loaded autocomplete")
  }




  render() {

    let {id, items, value, onChange, ...props} = this.props;

    const makeChange = (item) => {
      const target = {
        id: id,
        value: item,
        name: props.name || id
      }
      let e = {target: target};
      const f = (x)=> {
        console.log("changing auto:", e);
        onChange(e);
      }
      return f;
    }

    const data = _.map(items, (i, key)=><Item key={key} val={i} onClick={makeChange(i)} />)

    return (
      <div className="input-group">
        <TextInput className="form-control-sm" id={id} value={value} onChange={onChange} {...props} />
        <div className="input-group-append">
          <div className="dropdown-menu" aria-labelledby={this.dropId}>
            {data}
          </div>
          <button id={this.dropId}
            type="button"
            className="btn input-group-text btn-sm dropdown-toggle"
            data-toggle="dropdown"
            data-offset="-80%p"
            aria-haspopup="true" aria-expanded="false" >
              <span className="sr-only">Toggle Autocomplete</span>
            </button>
        </div>
      </div>
    )
  }
}


function Item (props) {
  return (
      <button className="btn btn-link dropdown-item"
        type="button"
        onClick={props.onClick}>{props.val}</button>
  )
}

export default AutoComplete;
