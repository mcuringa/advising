import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import net from "./net.js";
import SortableTable from "./SortableTable";

class StudentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      loading: true,
      filters: {
        showGrad: false,
        showCurrent: true,
        showAUI: true,
        showOnline: true,
        showInActive: false
      }
    };

  }

  componentDidMount() {
    const url = "/api/students";
    const loadStudents = (response)=> {
      let data = response.data;
      this.setState({ students: data, loading: false });
    }
    net.get(url).then(loadStudents);
  }

  render() {
    const headers = [
      ["id", "id_link"],
      ["first name", "first"],
      ["last name", "last"],
      ["email", "email"],
      ["major", "maj1"],
      ["last term", "last_registered"],
      ["grad", "graduated"],
      ["aui", "aui"],
      ["online", "online"]
    ];

    const prep = (s)=> {
      s.id_link = (<Link to={`/students/${s._id}`}>{s.student_id}</Link>)
      return s;
    }

    let filters = this.state.filters;

    let filter = (s)=> {
      if(!filters.showAUI && s.aui) {
        return false;
      }
      if(filters.showInactive && !s.active) {
        return false;
      }
      if(filters.showCurrent && !s.graduated) {
        return true;
      }
      if(filters.showGrad && s.graduated) {
        return true;
      }
      return false;
    }

    const toggleFilter = (f)=> {
      return ()=> {
        let filters = this.state.filters;
        filters[f] = !filters[f];
        this.setState({filters: filters});
      }
    }

    let students = _.map(this.state.students, prep);
    students = _.filter(students, filter);

    return (
      <section className="StudentList">
      <div className="card">
        <div className="card-header">
          Ed Tech Students
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-4">
                <FilterCheck
                  name="graduated"
                  key="showGrad"
                  toggle={toggleFilter("showGrad")}
                  checked={filters.showGrad} />

                <FilterCheck
                  name="current"
                  key="showCurrent"
                  toggle={toggleFilter("showCurrent")}
                  checked={filters.showCurrent} />
                  <FilterCheck
                    name="inactive students"
                    key="showInActive"
                    toggle={toggleFilter("showInActive")}
                    checked={filters.showInActive} />
              </div>

              <div className="col-md-4">
                <FilterCheck
                  name="AUI"
                  key="showAUI"
                  toggle={toggleFilter("showAUI")}
                  checked={filters.showAUI} />

                <FilterCheck
                  name="online"
                  key="showOnline"
                  toggle={toggleFilter("showOnline")}
                  checked={filters.showOnline} />
              </div>


            </div>
          </form>

        </div>
      </div>
        <SortableTable headers={headers} data={students} sortBy="first" />
      </section>
    )
  }
}

function FilterCheck(props) {
  return (
    <div className="form-check">
      <input className="form-check-input"
           onClick={props.toggle}
           id={props.key}
           type="checkbox"
           checked={props.checked} />
      <label className="form-check-label" for="current">{props.name}</label>
    </div>
  )
}

function StudentItem(student)  {
  return (
    <li key={student.student_id}>
      <Link className="nav-link" to={"/students/" + student._id}>
      {student.first} {student.last} [{student.maj1}]
      </Link>
    </li>
  )
}

export default StudentsScreen;
