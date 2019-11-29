import React from "react";
import _ from "lodash";
import { Link, Router } from "react-router-dom";
import net from "./net.js";


class StudentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      loading: true
    };

  }

  componentWillMount() {
    const url = "/api/students";
    const loadStudents = (data)=> {
      this.setState({ students: data, loading: false });
    }
    fetch(url).then(r =>r.json()).then(loadStudents);
  }


  render() {
    const li = _.map(this.state.students, StudentItem);
    console.log("student list:", li);
    return (
      <div>
        <h3>Students</h3>
        <ul>{li}</ul>
      </div>
    )
  }
}

function StudentItem(student)  {
  return (
    <li key={student.student_id}>
      <Link className="nav-link" to={"/students/" + student.student_id}>
      {student.first} {student.last}
      </Link>
    </li>
  )
}

class StudentPage extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      "student": {},
      "loading": true
    };
  }

  componentWillMount() {
    console.log("student page");


    const loadStudent = (response)=> {
      const student = response.data;
      loadInfo(student);
    }


    const loadInfo = (student)=> {
      const studUrl = "/api/students";

      const saveInfo = (response)=> {
        const completedFilter = (s) => s.student_id === student.student_id;
        const allStudents = _.sortBy(response.data, "term");

        let completed = _.filter(allStudents, completedFilter);
        completed = _.reverse(completed);

        let takenIds = _.map(completed, s=>s.student_id);
        takenIds = new Set(takenIds);


        // let's use a Set() to track who's not taken the course
        // they might be in ther registration collection multiple times
        // but we only need them once
        let needIds = new Set();
        const majors = ["EDN", "EDX", "EDT"];
        let need = [];
        for(let s of allStudents) {
          if(majors.includes(s.maj1)
            && !takenIds.has(s.student_id)
            && !needIds.has(s.student_id)) {
              need.push(s);
              needIds.add(s.student_id);
            }
        }
        need = _.reverse(need);
        this.setState( {
          students: student
        });
      }
      net.get(studUrl).then(saveInfo);
    }

    // load the data
    const studUrl = "/api/students/" + this.id;
    net.get(studUrl).then(loadStudent);

  }

  onSubmit() {
    const url = "/api/students/" + this.id;
    fetch(url);
  }

  handleChange(e) {
    e.preventDefault();
    let student = this.state.students;
    student[e.target.id] = e.target.value;
    this.setState({ student: student });
  }

  render() {
    const student = this.state.student;

    return (
      <div>
      <section>
        <p>this is more text</p>
      </section>
      <section id="StudentPage">
        <h3>{student.first} {student.last}</h3>
      </section>
      </div>
    )
  }
}

function term(t) {
  let semesters = {
    "09": "Fall",
    "02": "Spring",
    "06": "Summer",
    "01": "Winter"
  }
  let parts = t.split("/");
  return semesters[parts[1]] + " '" + parts[0];
}

export default StudentsScreen;
export { StudentPage };
