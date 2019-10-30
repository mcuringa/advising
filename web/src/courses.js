import React from "react";
import _ from "lodash";
import { Link, Router } from "react-router-dom";
import net from "./net.js";

// testing
// test 2

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
      console.log("courses loaded");
      console.log("course json data:", response);
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
      "registration": {},
      "loading": true
    };
  }

  componentWillMount() {

    const courseUrl = "/api/courses/" + this.id;
    const loadCourse = (response)=> {
      const course = response.data;
      console.log("data", course);
      this.setState({ course: course });
      loadReg(course.course_num);
    }

    net.get(courseUrl).then(loadCourse);

    const loadReg = (course_num)=> {
      const regUrl = "/api/registration?course_num=" + course_num;
      const saveReg = (response)=> {
        console.log("loaded course reg data");
        console.log(response.data);
        this.setState({ registration: response.data});
      }
      net.get(regUrl).then(saveReg);
    }
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
    console.log("course", course);
    return (
      <section id="CoursePage">
        <h1>{course.course_title}</h1>
        <h3>Students who have completed this course</h3>

//testing


      </section>
    )
  }
}

export default CourseScreen;
export { CoursePage };
