import React from "react";
import _ from "lodash";
import AutoComplete from "./ui/AutoComplete.js";

import {
  TextInput,
  Select,
  StringToType
} from "./ui/form-ui";

import { DeleteIcon, SaveIcon } from "./ui/icons";

function ScheduledCourse() {
  return {
    course_id: null,
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
    console.log("all courses:", props.allCourses);
    const blank = new ScheduledCourse();
    this.state = {
      course: _.merge(blank, props.course) || blank,
      loading: false,
      dirty: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.save = _.debounce(this.props.save, 300);
  }

  handleChange(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    if (key === "format" && e.target.value === "online") {
      course.location = "online";
    }
    course[key] = StringToType(e.target.value);
    this.setState({ course: course, dirty: true });
    if(course.course_id) {
      this.save(course);
    }
  }

  onSubmit (e) {
    let course = this.state.course;
    e.preventDefault();
    if (!course.course_id) {
      e.target.reset();
      this.setState({course: new ScheduledCourse()})
    }
    this.props.save(course);
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
    const locations = {"online":"online", "MC":"Manhattan", "GC":"Garden City"};

    const locationCss = (course.format === "online")?"d-none":"";
    const DelButton = (course.course_id)?(<button className="btn btn-sm btn-light" onClick={this.props.delete} type="button"><DeleteIcon /></button>) : null;

    return (
      <div className={this.props.className}>
        <form className="CourseForm" onSubmit={this.onSubmit}>

          <div className="form-row mb-1"> { /* course num, title, instructor */ }
            <div className="col-md-2">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_num"  placeholder="858-xxx" value={course.course_num} required />
            </div>
            <div className="col-md-4">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_title" placeholder="title" value={course.course_title} required />
            </div>
            <Instructors onChange={this.handleChange} instructor={course.instructor} />
            <div className="col-md-2">
              <Select id="format" className="form-control-sm" options={formats} onChange={this.handleChange} value={course.format} />
            </div>

            <div className="col-md-2">
              <button className="btn btn-sm btn-light" type="submit"><SaveIcon className="icon-primary" /></button>
              {DelButton}
            </div>
          </div>

          <div className={`form-row ${locationCss}`}> { /* schedule info */ }

            <div className="col-md-2 offset-md-2">
              <Select id="location" className="form-control-sm text-primary" options={locations} onChange={this.handleChange} value={course.location} />
            </div>

            <div className="col-md-2">
              <Select id="format" onChange={this.handleChange} className="form-control-sm text-primary" options={days} selected={course.day}/>
            </div>

            <div className="col-md-2">
              <TextInput className="form-control-sm text-primary" onChange={this.handleChange} id="start" placeholder="start" value={course.start} />
            </div>
            <div className="col-md-2">
              <TextInput className="form-control-sm text-primary" onChange={this.handleChange} id="end" placeholder="start" value={course.end} />
            </div>

          </div>
        </form>
      </div>
    )
  }
}


function Courses (props) {
  const instructors = [
    "Aaron Hung",
    "Matt Curinga",
    "Elizabeth de Freitas",
    "Tom Jennings",
    "Ryan Sobeck",
    "Kai Williams",
    "Christian Correa",
    "Robby Lucia",
    "Nicholas"
  ];

  // const startsWith = (a, b)=>a.toLowerCase().startsWith(b.toLowerCase());
  //
  // const renderF = (item, value) => {
  //   if (value.length === 0) {
  //     return true;
  //   }
  //   if (value.length === 1 && item.starts) {
  //     return startsWith(item.label, value);
  //   }
  //   return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
  // }


  // <TextInput className="form-control-sm" onChange={props.onChange} id="instructor"  placeholder="instructor" value={props.instructor} />

  return (
    <div className="col-md-2">
      <AutoComplete
        id="instructor"
        items={instructors}
        value={props.instructor}
        onChange={props.onChange}
      />
    </div>
  )


}


function Instructors (props) {
  const instructors = [
    "Aaron Hung",
    "Matt Curinga",
    "Elizabeth de Freitas",
    "Tom Jennings",
    "Ryan Sobeck",
    "Kai Williams",
    "Christian Correa",
    "Robby Lucia",
    "Nicholas"
  ];

  // const startsWith = (a, b)=>a.toLowerCase().startsWith(b.toLowerCase());
  //
  // const renderF = (item, value) => {
  //   if (value.length === 0) {
  //     return true;
  //   }
  //   if (value.length === 1 && item.starts) {
  //     return startsWith(item.label, value);
  //   }
  //   return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1;
  // }


  // <TextInput className="form-control-sm" onChange={props.onChange} id="instructor"  placeholder="instructor" value={props.instructor} />

  return (
    <div className="col-md-2">
      <AutoComplete
        id="instructor"
        items={instructors}
        value={props.instructor}
        onChange={props.onChange}
      />
    </div>
  )


}

export default CourseScheduleForm;
export {ScheduledCourse};
