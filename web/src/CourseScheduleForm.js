import React from "react";

import net from "./net.js";
import { StatusIndicator,
  TextGroup,
  RadioButtonGroup,
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
    meetingTimes: [],
    notes: ""
  }
}

class CourseScheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.course || new ScheduledCourse(),
      loading: (this.id)?true:false,
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
    props.save();
  }

  render() {

    const course = this.state.course;

    return (

      <section className="CourseDetail mt-3">
        <div className="card">
          <div className="card-body">
            <form className="CourseForm" onSubmit={this.onSubmit}>
              <div className="row">
                <Col cols="2">
                  <TextInput onChange={this.handleChange} id="course_num"  hint="course number" value={course.course_num} />
                </Col>
                <Col cols="10">
                  <TextInput onChange={this.handleChange} id="course_title" hint="title" value={course.course_title} required />
                </Col>
              </div>
              <div className="row">
                <Col cols="9">
                  <TextInput onChange={this.handleChange} id="instructor"  hint="instructor" value={course.instructor} />
                </Col>
                <Col cols="3">
                  <TextInput onChange={this.handleChange} id="credits"
                    hint="credits"
                    value={course.credits} type="number"
                    min="0" max="6" />
                </Col>
              </div>
              <div className="row">
                <Col cols="6">
                  <RadioButtonGroup onChange={this.handleChange} id="required"
                    value={course.required}
                    options={{"required":true,"elective":false}} />
                </Col>
                <Col cols="6">
                  <RadioButtonGroup onChange={this.handleChange} id="required"
                    value={course.required}
                    options={{"required":true,"elective":false}} />
                </Col>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}

function Col(props) {
  return (
    <div className={`col-md-${props.col} ${props.css}`}>{props.children}</div>
  )
}


export default CourseScheduleForm;
