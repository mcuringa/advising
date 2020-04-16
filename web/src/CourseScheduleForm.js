import React from "react";
import _ from "lodash";

import net from "./net.js";
import { StatusIndicator,
  TextGroup,
  TextInput,
  TextArea,
  Checkbox,
  Select,
  StringToType
} from "./ui/form-ui";

function ScheduledCourse() {
  return {
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
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = _.debounce(this.props.save, 300);
  }

  handleChange(e) {
    e.preventDefault();
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    course[key] = StringToType(e.target.value);
    this.setState({ course: course, dirty: true });
    this.save(course);
  }

  onSubmit (e) {
    console.log("submitting");
    e.preventDefault();
    this.props.save(this.state.course);
  }

  render() {

    const course = this.state.course;
    const days = {
      "monday": "Mon",
      "tuesday": "Tue",
      "wednesday": "Wed",
      "thursday": "Thu",
      "friday": "Fri",
      "saturday": "Sat",
      "sunday": "Sun"
    };

    const formats = _.keyBy(["online", "blended", "campus"], o=>o);

    const toggleRequired = ()=> {
      let e = { target: {} };
      e.target.id = "required";
      e.target.value = !course.required;
      this.handleChange(e);
    }

    const locationDisabled = course.format === "online" || null;

    return (
      <div className={this.props.className}>
        <form className="CourseForm" onSubmit={this.onSubmit}>

          <div className="form-row mb-1"> { /* course num, title, instructor */ }
            <div className="col-md-2">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_num"  placeholder="course #" value={course.course_num} required />
            </div>
            <div className="col-md-6">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_title" placeholder="title" value={course.course_title} required />
            </div>
            <div className="col-md-3">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="instructor"  placeholder="instructor" value={course.instructor} />
            </div>
            <div className="col-md-1">
              <button className="btn btn-sm btn-primary" type="submit">S</button>
              <button className="btn btn-sm btn-danger" type="button">X</button>
            </div>
          </div>

          <div className="form-row"> { /* format, day/time, credits, required, buttons */ }
            <div className="col-md-2">
              <Select id="format" className="form-control-sm" options={formats} onChange={this.handleChange} value={course.format} />
            </div>

            <div className="col-md-2">
              <Select id="format" onChange={this.handleChange} className="form-control-sm" options={days} selected={course.day} locationDisabled />
            </div>

            <div className="col-md-2">
              <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="start" placeholder="start" value={course.start} locationDisabled />
            </div>
            <div className="col-md-2">
              <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="end" placeholder="start" value={course.end} locationDisabled />
            </div>
            <div className="col-md-1">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="credits"
                divolder="credits"
                value={course.credits} type="number"
                min="0" max="6" />
            </div>
            <div className="col-md-2 bg-light rounded">
              <small><Checkbox className="p-0 mt-1" onChange={toggleRequired} id="required" label="required" /></small>
            </div>
          </div>
        </form>
        <hr />
      </div>
    )
  }
}


export default CourseScheduleForm;
