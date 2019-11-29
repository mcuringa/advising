import React from "react";
import _ from "lodash";
import { Link, Router } from "react-router-dom";
import net from "./net.js";


class CourseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      loading: true
    };

  }

  componentWillMount() {
    const url = "/api/courses";
    const loadCourses = (response)=> {
      // console.log("courses loaded");
      // console.log("course json data:", response);
      this.setState({ courses: response.data, loading: false });
    }
    // fetch(url).then(r =>r.json()).then(loadCourses);
    net.get(url).then(loadCourses);
  }


  render() {
    const li = _.map(this.state.courses, CourseItem);
    console.log("course list:", li);
    return (
      <div>
        <h3>Courses</h3>
        <ul>{li}</ul>
      </div>
    )
  }
}


function CourseItem(course)  {
  return (
    <li key={course.course_num}>
      <Link className="nav-link" to={"/courses/" + course._id}>
        {course.course_num} {course.course_title}
      </Link>
    </li>
  )
}

class CoursePage extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      "course": {},
      need: [],
      completed: [],
      "loading": true
    };
  }

  componentWillMount() {
    console.log("course page");



    // get the coures info, then load registration
    const loadCourse = (response)=> {
      const course = response.data;
      // console.log("data", course);
      loadReg(course);
    }


    // then get the registration and save it to state
    const loadReg = (course)=> {
      // load the full registration table
      const regUrl = "/api/registration";

      const saveReg = (response)=> {
        const completedFilter = (s) => s.course_num === course.course_num;
        const allStudents = _.sortBy(response.data, "term");
        // find who took the course (and sort)
        let completed = _.filter(allStudents, completedFilter);
        completed = _.reverse(completed);
        // get all of the student ids of students who've taken the course
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
          course: course,
          completed: completed,
          need: need
        });
      }
      net.get(regUrl).then(saveReg);
    }

    // load the data
    const courseUrl = "/api/courses/" + this.id;
    net.get(courseUrl).then(loadCourse);

  }

  onSubmit() {
    const url = "/api/courses/" + this.id;
    fetch(url);
  }

  handleChange(e) {
    e.preventDefault();
    let course = this.state.courses;
    course[e.target.id] = e.target.value;
    this.setState({ course: course });
  }

  render() {
    const course = this.state.course;
    // console.log("course", course);

    return (
      <div>
      <section id="CoursePage">
        <h3>{course.course_title}</h3>
      </section>

      <section id="CompletedStudents">
        <h4>Students who still need {course.course_num}</h4>
        <RegistrationTable students={this.state.need} />
      </section>

      <section id="CompletedStudents">
        <h4>Students who have completed {course.course_num}</h4>
        <RegistrationTable students={this.state.completed} />
      </section>
      </div>
    )
  }
}

function RegistrationTable(props) {
  const students = _.map(props.students, StudentRow);
  return (
    <table className="table table-striped table-sm">
      <thead className="thead-light">
        <tr>
          <th scope="col">#</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">Semester</th>
        </tr>
      </thead>
      <tbody>{students}</tbody>
    </table>
  )
}


/**
 * takes a term string in format 9/13
 * and returns a string in format
 * Fall '13
 */
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

function StudentRow(student, key) {
  return (
    <tr key={key}>
      <th scope="row">{key+1}</th>
      <td>{student.first}</td>
      <td>{student.last}</td>
      <td>{term(student.term)} ({student.term})</td>
    </tr>
  )
}

export default CourseScreen;
export { CoursePage };
