import React from "react";
import _ from "lodash";
import { Link, Router } from "react-router-dom";



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
    const loadCourses = (data)=> {
      this.setState({ courses: data, loading: false });
    }
    fetch(url).then(r =>r.json()).then(loadCourses);
  }


  render() {
    const li = _.map(this.state.courses, CourseItem);
    return (
      <div>
        <h3>Courses</h3>
        <ul>{li}</ul>
      </div>
    )
  }
}

class CourseListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      course: {},
      loading: true
    };

  }

  componentWillMount() {
    const url = "/api/courses/" + this.props.params.id;
    const loadCourses = (data)=> {
      this.setState({ course: data, loading: false });
    }
    fetch(url).then(r =>r.json()).then(loadCourses);
  }

  onSubmit() {
    const url = "/api/courses/" + this.props.params.id;
    fetch(url, {mode: "cors", method: "PUT"});
  }

  handleChange(e) {
    e.preventDefault();
    let course = this.state.course_num;
    course[e.target.id] = e.target.value;
    this.setState({ course: course });
  }

  render() {
    return (
      <div>
        <h3>{this.state.course.title}</h3>
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

export default CourseScreen;
export { CourseListScreen };
