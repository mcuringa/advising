import React from "react";
import _ from "lodash";

import {
  ComboBox,
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
    // console.log("all courses:", props.allCourses);
    const blank = new ScheduledCourse();
    this.state = {
      course: _.merge(blank, props.course) || blank,
      loading: false,
      dirty: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.makeCourseControl = this.makeCourseControl.bind(this);
    this.save = _.debounce(this.props.save, 300);
  }

  handleChange(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    console.log("change made to:", key);

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

  makeCourseControl() {
    let course = this.state.course;

    const selectItem = (item)=> {
      // console.log("calling select item");
      course.course_num = item.course_num;
      course.course_title = item.course_title;
      this.setState({ course: course, dirty: true });
      if(course.course_id) {
        this.save(course);
      }
    }

    const items = _.map(this.props.allCourses,c=>_.merge(c, {label:c.course_num + " " + c.course_title}));

    return (
      <ComboBox
        id="course_num"
        value={course.course_num}
        placeholder="858-xxx"
        items={items}
        selectItem={selectItem}
        className="form-control-sm"
        onChange={this.handleChange}
        required />
    )

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
            <div className="col-md-2">{this.makeCourseControl()}</div>
            <div className="col-md-4">
              <TextInput className="form-control-sm" onChange={this.handleChange} id="course_title" placeholder="title" value={course.course_title} required />
            </div>
            <div className="col-md-2">
              <Instructors onChange={this.handleChange} instructor={course.instructor} />
            </div>
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


function Instructors (props) {

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

  let id="instructor";

  const makeChange = (item) => {
    const target = {
      id: id,
      value: item,
      name: props.name || id
    }
    let e = {target: target};
    const f = (x)=> {
      console.log("changing auto:", e);
      props.onChange(e);
    }
    return f;
  }

  const Item = (val)=> {
    const f = makeChange(val);
    return (
        <button key={val} className="dropdown-item" onClick={f} type="button">{val}</button>
    )
  }

  const suggestions = _.map(instructors, Item)


  return (
      <div className="input-group mb-3">
        <TextInput className="form-control-sm" onChange={props.onChange} id="instructor"  placeholder="instructor" value={props.instructor} />
        <div className="input-group-append">
          <div className="btn-group">
            <button type="button" className="btn btn-primary dropdown-toggle dropdown-toggle-split p-0 pl-1 pr-1 rounded-0 rounded-top-right rounded-bottom-right m-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <div className="dropdown-menu dropdown-menu-right">{suggestions}</div>
          </div>
        </div>
      </div>
  )

}

export default CourseScheduleForm;
export {ScheduledCourse};
