import React from "react";
import _ from "lodash";
import classNames from 'classnames/bind';
import { createPopper } from '@popperjs/core';


import "./AutoComplete.css";
import {
  TextInput
} from "./form-ui";




class AutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.popId  = _.uniqueId("drop_");
  }


  componentDidMount() {
    const popcorn = document.getElementById(this.popId);
    const tip = popcorn.querySelector(".complete-options");
    let popper = createPopper(popcorn, tip, {
      placement: "bottom-start",
    });
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


    const weightItems = (i)=>{

    }

    items = _.filter(items,i=>i.toLowerCase().includes(value.toLowerCase()));

    let showOptions = items.length;

    const data = _.map(items, (i, key)=><Item key={key} val={i} onClick={makeChange(i)} />)
    let css = classNames("list-group w-100 complete-options", {"d-none": !showOptions})

    return (
      <div id={this.popId} className="input-group">
        <TextInput className="form-control-sm rounded-0 rounded-top" id={id} value={value} onChange={onChange} {...props} />
        <div className={css}>
            {data}
        </div>
      </div>
    )
  }
}

function Item (props) {
  return (
      <button className="list-group-item list-group-item-action p-0 m-0"
        type="button"
        onClick={props.onClick}>{props.val}</button>
  )
}

export default AutoComplete;
