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
    console.log("handling: ", e.target);
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    console.log("data: ", key, e.target.value);
    course[key] = StringToType(e.target.value);
    this.setState({ course: course, dirty: true });
    // this.props.save();
  }

  render() {

    const course = this.state.course;
    console.log("course", course);
    const days = {
      "Monday": "Mon",
      "Tuesday": "Tue",
      "Wednesday": "Wed",
      "Thursday": "Thu",
      "Friday": "Fri",
      "Saturday": "Sat",
      "Sunday": "Sun"
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
      <div className="">
        <form className="CourseForm" onSubmit={this.onSubmit}>
          <div className="row">
            { /* course num, title, format */ }
            <div className="p-1 col-md-2 col-lg-1">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_num"  placeholder="course #" value={course.course_num} />
            </div>
            <div className="p-1 col-md-7 col-lg-6">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_title" placeholder="title" value={course.course_title} required />
            </div>
            <div className="p-1 col-md-3 col-lg-2">
              <Select id="format" className="form-control-sm" options={formats} onChange={this.handleChange} value={course.format} />
            </div>
            <div className="p-1 col-md-1">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="credits"
                divolder="credits"
                value={course.credits} type="number"
                min="0" max="6" />
            </div>
            <div className="p-1 col-md-2 border rounded">
              <Checkbox onChange={toggleRequired} id="required" label="required" />
            </div>


            <div className="p-1 col-md-2">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="instructor"  placeholder="instructor" value={course.instructor} />
            </div>



            <div className="p-1 col-md-2">
              <Select id="format" onChange={this.handleChange} className="form-control-sm" options={days} selected={course.day} locationDisabled />
            </div>
            <div className="p-1 col-md-2">
              <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="start" placeholder="start" value={course.start} locationDisabled />
            </div>
            <div className="p-1 col-md-2">
              <TextInput className="form-control-sm" type="time" onChange={this.handleChange} id="end" placeholder="start" value={course.end} locationDisabled />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

function Col(props) {
  return (
    <div className={`p-1 col-md-${props.cols} ${props.css||""}`}>{props.children}</div>
  )
}


export default CourseScheduleForm;
