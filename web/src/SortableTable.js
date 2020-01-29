import React, { Component } from "react";
import _ from "lodash";

class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asc: props.asc || true,
      sortBy: props.sortBy || null
    };
  }

  render() {
    let data = this.props.data;
    if(this.state.sortBy) {
      data = _.sortBy(data, this.state.sortBy);
    }
    if(!this.state.asc) {
      data = _.reverse(data);
    }

    const sort =(col)=> {
      if (col === this.state.sortBy) {
        this.setState({asc: !this.state.asc});
      }
      else {
        this.setState({sortBy: col});
      }
    }

    const row = s=> TableRow(s, this.props.headers);
    const Rows = _.map(data, row)

    return (
      <table className="SortableTable table">
      <TableHeader
        headers={this.props.headers}
        activeKey={this.state.sortBy}
        asc={this.state.asc}
        sortFunction={sort} />
        <tbody>
          {Rows}
        </tbody>
      </table>
    );
  }
}

function TableRow(student, headers) {
  let keys = _.map(headers, h=>h[1]);
  let values = _.reduce(keys, (t,k)=> {
    t.push(student[k]);
    return t;
  }, []);

  let cells = _.map(values, (v)=>{
    if (typeof v === "boolean") {
      v = (v)?"✓":"-";
    }
    return (<td>{v}</td>)
  });
  return (<tr>{cells}</tr>);
}

function TableHeader(props) {
  console.log("key", props.activeKey);
  const orderIcon = (key)=> {
    if(key !== props.activeKey) {
      return (<span className="spacer pl-2" />);
    }
    if(props.asc) {
      return "▲";
    }
    return "▼";
  }

  const th = (header)=> {
    let [label, key] = header;
    return (
      <th scope="col">
        <button className="SortableTableHeader btn btn-link"
         onClick={(e)=> props.sortFunction(key)}>
          {label}
          {orderIcon(key)}
        </button>
      </th>
    );
  }

  const headers = _.map(props.headers, th);
  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
}

export default SortableTable;
