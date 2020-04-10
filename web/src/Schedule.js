import React from "react";
import _ from "lodash";
import {DateTime} from "luxon";
import net from "./net.js";
import { LoadingSpinner, StatusIndicator, StringToType } from "./ui/form-ui";
import  * as dates from "./ui/dates.js";

class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          plans: [],
        courses: [],
      schedules: [],
          dirty: false,
        loading: true
    };
  }

  componentDidMount() {
    const store = ([plans, courses, schedules])=>  {
      courses = _.sortBy(courses.data, "course_num");
      schedules = _.sortBy(schedules.data, "term");
      this.setState( {
        plans: plans.data,
        courses: courses,
        schedules: schedules,
        loading: false
      });
    }
    Promise.all([net.get("/api/plans"), net.get("/api/courses"), "/api/plans"]).then(store);
  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner loading />
    }
    let courses = this.state.courses;
    let schedules = this.state.schedules;

    const addSchedule = ()=> {
      let term = dates.nextTerm();
      if (schedules[0]) {
        term = dates.nextTerm(this.props.schedule[0])
      }
      schedules = _.concat(schedules, new Schedule(term));
      this.setState({schedules: schedules});
    }

    console.log("schedules:", schedules);

    return (

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex">
            <h5 className="pb-0 mb-0">schedule</h5>
            <button className="btn btn-sm btn-primary" onClick={addSchedule}>add</button>
          </div>
        </div>
        <div className="col-md-6">
          <h5>courses</h5>
          <CourseList courses={courses} />
        </div>
      </div>
    )
  }
}


function CourseList (props) {

  const CourseList = _.map(props.courses, CourseItem)

  return (
    <div id="CourseList">
      {CourseList}
    </div>
  )
}

function CourseSymbol (props) {
  if (props.course.required) {
    return (<span className="RequiredCourse text-primary pl-1 pr-1">✓</span>);
  }
  return (<span className="ElectiveCourse text-success pl-1 pr-1">★</span>);
}

function CourseItem(course, i)  {
  let css = "";
  return (
    <div key={i} className={`CourseItem list-group-item ${css}`} data-course_num={course.course_num}>
      <span className="pl-2 pt-1">{course.course_num} {course.course_title}</span>
      <CourseSymbol course={course} /> ({course.credits})
    </div>
  )
}



function Schedule(term) {
  return {
    _id: null,
    term: term,
    courses: []
  }
}

class ScheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: props.term,
      loading: false,
      dirty: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    course[key] = StringToType(e.target.value);
    this.setState({ course: course, dirty: true });
    // this.save();
  }

  render() {
    return (
      <div className="card mb-2">
        <div className="card-header d-flex justify-content-between">
          <h4>{dates.termName(this.props.term)}</h4>
          <StatusIndicator loading={this.state.loading}
            dirty={this.state.dirty}
            className="pr-3" />
        </div>
        <div className="card-body"></div>
      </div>
    );
  }
}





export default ScheduleScreen;
