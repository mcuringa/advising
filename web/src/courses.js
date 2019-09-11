import React from "react";
import _ from "lodash";



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

function CourseItem(course)  {
  return (
    <li key={course.course_num}>{course.course_num} {course.course_title}</li>
  )
}

export default CourseScreen;
