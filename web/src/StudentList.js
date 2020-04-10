import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import net from "./net.js";
import SortableTable from "./ui/SortableTable";
import { StatusIndicator } from "./ui/form-ui";

class StudentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      loading: true,
      dirty: false,
      allStudents: false
    };
    this.save = this.save.bind(this);

  }

  save(s) {
    const saved = (r)=> {
      console.log("saved student with result:", r);
      this.setState({dirty: false, loading: false});
    }
    const url = "/api/students/" + s._id;
    net.put(url, s).then(saved).catch((e)=>{
      console.log("failed to save student:", e);
      this.setState({loading: false, error: "Failed to save changes to student. " + e.stack});
    });
  }

  componentDidMount() {
    console.log("mounting student list");
    const url = "/api/students";
    const loadStudents = (response)=> {
      let data = response.data;
      console.log(data);
      this.setState({ students: data, loading: false });
    }
    net.get(url).then(loadStudents);
  }

  render() {
    const headers = [
      ["id", "student_id"],
      ["first", "first"],
      ["last", "last"],
      // ["email", "email"],
      ["grad", "graduated"],
      ["aui", "aui"],
      ["online", "online"],
      ["active", "active"]
    ];

    const mapValues = (key, s)=> {
      let values = {};
      values["student_id"] = (<Link to={`/students/${s._id}`}>{s.student_id}</Link>)
      values["active"] = (<TSB student={s} field="active" icon={(s.active)?"🙂" : "😴"} />);
      values["graduated"] = (<TSB student={s} field="graduated" icon={(s.graduated)?"🎓" : "–"} />);
      values["aui"] = (<TSB student={s} field="aui" icon={(s.aui)?"🇺🇳" : "–"} />);
      values["online"] = (<TSB student={s} field="online" icon={(s.online)?"📡" : "–"} />);

      return values[key] || s[key];

    }

    const TSB = (props)=> { // ToggleAndSaveButton
      let s = props.student, field = props.field, icon = props.icon;
      const f = ()=> {
        this.setState({dirty: true, loading: true});
        console.log("clicked on student:", s);
        console.log("field:", field);

        s[field] = !s[field];
        this.save(s);
      };
      return (<button className="p-0 m-0 btn btn-link" onClick={f}>{icon}</button>);
    }

    let students = _.sortBy(this.state.students, "first");
    if (!this.state.allStudents) {
      students = _.filter(students, s=>!s.graduated && s.active);
    }
    const toggleAll = ()=>{this.setState({allStudents: !this.state.allStudents})};
    return (
      <section className="StudentList mt-2">
        <div className="d-flex justify-content-between">
          <h3>Ed Tech Students</h3>
          <StatusIndicator loading={this.state.loading} dirty={this.state.dirty}
            className="pr-3" />
        </div>
        <form className="d-flex">
          <div className="pr-2">
            <input type="radio"
              name="allStudents"
              checked={this.state.allStudents} onChange={toggleAll} /> all students
          </div>
          <div>
            <input type="radio"
              name="allStudents"
              checked={!this.state.allStudents} onChange={toggleAll} /> active students
          </div>
        </form>
        <SortableTable counter headers={headers} data={students} mapper={mapValues} sortBy="first" />
      </section>
    )
  }
}

export default StudentsScreen;
