import React from "react";
import _ from "lodash";

import net from "./net.js";
import { StatusIndicator,
  TextGroup,
  TextInput,
  Checkbox,
  Select,
  StringToType
} from "./ui/form-ui";

function ScheduledCourse() {
  return {
    _id: null,
    course_num: "",
    course_title: "",
    required: false,
    credits: 3,
    instructor: "",
    format: "online",
    location: "online",
    day: "",
    start: "16:30",
    end: "18:20",
    notes: ""
  }
}

class CourseScheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.course || new ScheduledCourse(),
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
    // this.props.save();
  }

  render() {

    const course = this.state.course;
    const days = _.keyBy(["M", "T", "W", "Th", "F", "S", "Su"], d=>d);
    const formats = _.keyBy(["online", "blended", "classroom"], o=>o);

    const toggleRequired = ()=> {
      let e = { target: {} };
      e.target.id = "required";
      e.target.value = !course.required;
      this.handleChange(e);
    }

    return (
      <form className="CourseForm" onSubmit={this.onSubmit}>
        <div className="row">
          <Col cols="2">
            <TextInput className="form-control-sm" onChange={this.handleChange} id="course_num"  placeholder="course #" value={course.course_num} />
          </Col>
          <Col cols="6">
            <TextInput className="form-control-sm" onChange={this.handleChange} id="course_title" placeholder="title" value={course.course_title} required />
          </Col>
          <Col cols="2">
            <Select id="format" options={formats} selected={course.format} />
          </Col>
        </div>
        <div className="row">
          <Col cols="6">
            <Select id="format" options={days} selected={course.day} />
          </Col>
          <Col cols="2">
            <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="start" placeholder="start" value={course.start} />
          </Col>
          <Col cols="2">
            <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="end" placeholder="start" value={course.end} />
          </Col>
        </div>
        <div className="row">
          <Col cols="4">
            <TextInput className="form-control-sm" onChange={this.handleChange} id="instructor"  placeholder="instructor" value={course.instructor} />
          </Col>
          <Col cols="2">
            <TextInput className="form-control-sm" onChange={this.handleChange} id="credits"
              placeholder="credits"
              value={course.credits} type="number"
              min="0" max="6" />
          </Col>
          <Col cols="4">
            <Checkbox onChange={toggleRequired} id="required" label="required" />
          </Col>

        </div>
      </form>
    )
  }
}

function Col(props) {
  return (
    <div className={`p-1 col-md-${props.cols} ${props.css||""}`}>{props.children}</div>
  )
}


export default CourseScheduleForm;
