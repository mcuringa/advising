import React from "react";
import _ from "lodash";

class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      asc: props.asc || true,
      sortBy: _.concat([], props.sortBy) || []
    };
  }

  render() {
    let data = this.props.data;

    const by = (d)=> {
      let key = _.join(_.values(_.pick(d, this.state.sortBy)), " ")
      // console.log("key:", key);
      return key;
    }

    if(this.state.sortBy) {
      data = _.sortBy(data, by);
    }

    if(!this.state.asc) {
      data = _.reverse(data);
    }

    const sort = (col)=> {
      if (col === this.state.sortBy[0]) {
        this.setState({asc: !this.state.asc});
      }
      else {
        let by =  this.state.sortBy;
        console.log("old sort order:", by);
        by = _.concat(col, by);
        by = _.slice(by, 0, 4);
        console.log("new sort order:", by);
        this.setState({sortBy: by});
      }
    }

    const row = (o, i)=> {
      return (
        <TableRow key={i} data={o}
          index={i}
          headers={this.props.headers}
          counter={this.props.counter}
          mapper={this.props.mapper} />
      );
    }

    const Rows = _.map(data, row)
    let headers = this.props.headers;
    return (
      <table className="SortableTable table">
      <TableHeader
        headers={headers}
        counter={this.props.counter}
        activeKey={this.state.sortBy[0]}
        asc={this.state.asc}
        sortFunction={sort} />
        <tbody>
          {Rows}
        </tbody>
      </table>
    );
  }
}

function TableRow (props) {
  let data = props.data;
  let headers = props.headers;
  let counter = props.counter;
  let i = props.index;
  let mapper = props.mapper || String;

  let keys = _.map(headers, h=>h[1]);
  let values = _.reduce(keys, (t,k)=> {
    t.push(mapper(k, data));
    return t;
  }, []);

  let cells = _.map(values, (v, j)=> {
    return (<td key={j}>{v}</td>)
  });

  if(counter) {
    cells.unshift(<td key="-1">{i + 1}</td>);
  }
  return (<tr key={i}>{cells}</tr>);
}

function TableHeader(props) {
  const orderIcon = (key)=> {
    if(key !== props.activeKey) {
      return (<span className="spacer pl-2" />);
    }
    if(props.asc) {
      return "▲";
    }
    return "▼";
  }

  const th = (header, i)=> {
    let [label, key] = header;
    return (
      <th scope="col" key={i}>
        <button className="SortableTableHeader btn btn-link"
         onClick={(e)=> props.sortFunction(key)}>
          {label}
          {orderIcon(key)}
        </button>
      </th>
    );
  }

  let headers = _.map(props.headers, th);
  if (props.counter) {
    headers.unshift((<th scope="col" key="-1">#</th>));
  }

  return (
    <thead>
      <tr>{headers}</tr>
    </thead>
  );
}

export default SortableTable;
