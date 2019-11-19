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

// function filterEnrolledStudents(course) {
//   const response = await fetch('/api/registration');
//   const registration = await response.json();
//     console.log(JSON.stringify(registration));
//   let studentsEnrolled = coursesAPI.filter((course_id) => {
//     return registration.course_id === "course_id"
//   })
//   return studentsEnrolled;
// }

// 1. Does fetch() have to be within  a component?
// 2. Does /api/registration suffice as a URL? Do I need http://localhost:3000/?
// 3. I took the fetch() info from:
  // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  // 3a. I recall await from the spring and think it is needed here since
  // the it will vary as each unique course page loads.
  // 3b. I knkow you said that the URl was a string and thus a problem, which I 
  // understand from a string/parameter standpoint, but other instances of
  // the URL being called do utilize it as a string, which I do not understand.
// 4. Robby helped me take my english explanation of the function's filter
// and suggested a way to write it (line 59/60) but I don't understtand how that
// works. Is that an abbreviated loop?

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
      <div>
      <section id="CoursePage">
        <h3>{course.course_title}</h3>
      </section>
      <section id="CourseTable">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Students who have completed this course</th>
            <th scope="col">Students who have not completed this course</th>
            <th scope="col">Expected Year of Graduation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>First name, last name</td>
            <td>First name, last name</td>
            <td>May 2021</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>First name, last name</td>
            <td>First name, last name</td>
            <td>December 2021</td>
          </tr>
        </tbody>
        </table>
      </section>
      <section>
        <p>this is more text</p>
      </section>
      </div>
    )
  }
}

export default CourseScreen;
export { CoursePage };
