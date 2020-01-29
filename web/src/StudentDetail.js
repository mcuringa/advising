import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import net from "./net.js";

class StudentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      "student": {},
      "loading": true
    };
  }

  componentWillMount() {

    const loadStudent = (response)=> {
      const student = response.data;
      this.setState( {
        student: student,
        loading: false
      });
    }
    // load the data
    const studUrl = "/api/students/" + this.id;
    console.log("getting student", studUrl);
    net.get(studUrl).then(loadStudent);

  }

  onSubmit() {
    const url = "/api/students/" + this.id;
    net.put(url, this.state.student);
  }

  handleChange(e) {
    e.preventDefault();
    let student = this.state.students;
    student[e.target.id] = e.target.value;
    this.setState({ student: student });
  }

  render() {
    const student = this.state.student;
    if(this.state.loading) {
      return <Loading loading={true} msg="loading student" />
    }

    console.log("student", student);
    console.log("student_id", student.student_id);

    return (

      <section id="StudentPage">
        <h3>{student.first} {student.last}</h3>
        <Transcript student_id={student.student_id} />
      </section>
    )
  }
}

function Loading (props) {
  if(!props.loading) {
    return false;
  }
  const msg = props.msg || "Loading...";
  return (
    <div className="spinner-border m-5" role="status">
      <span className="sr-only">{msg}</span>
    </div>
  )
}

class Transcript extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "courses": [],
      "loading": true
    };
  }

  componentWillMount() {

    const f = (response)=> {
      let courses = _.sortBy(response.data, "term");
      this.setState( { courses: courses });
    }
    // load the data
    const url = "/api/registration?student_id=" + this.props.student_id;
    net.get(url).then(f);

  }

  render() {
    const courses = _.map(this.state.courses, CourseItem);
    return (
      <div>
        <h4>Transcript</h4>
        <table>{courses}</table>
      </div>
    )
  }
}

function CourseItem(course)  {
  return (
    <tr key={course.course_num}>
      <td>
        <Link className="nav-link" to={"/courses/" + course._id}>
          {course.course_num} {course.course_title}
        </Link>
      </td>
      <td>{course.term}</td>
    </tr>
  )
}

export default StudentDetail;