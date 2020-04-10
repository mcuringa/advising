import React from "react";

import net from "./net.js";
import { StatusIndicator,
  TextGroup,
  RadioButtonGroup,
  StringToType
} from "./ui/form-ui";

function Course() {
  return {
    _id: null,
    course_num: "",
    course_title: "",
    url: "",
    required: false,
    credits: 3
  }
}

class CourseForm extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      course: new Course(),
      loading: (this.id)?true:false,
      dirty: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {

    const loadCourse = (response)=> {
      let course = response.data;
      course.url = course.url || "";
      this.setState( {
        course: course,
        loading: false
      });
    }
    // load the data
    const url = "/api/courses/" + this.id;
    if (this.id) {
      net.get(url).then(loadCourse);
    }
    else {
      console.log("new course");
    }

  }


  onSubmit(e) {
    e.preventDefault();
    let course = this.state.course;
    const url = "/api/courses/" + course._id;
    const saved = (r)=> {
      console.log("saved response:", r)
      this.setState({dirty: false, loading: false});
    }
    const error = (e)=>{
      console.log("failed to save course:", e);
      this.setState({loading: false, error: "Failed to save changes. " + e.stack});
    };

    this.setState({ loading: true });
    net.put(url, course).then(saved).catch(error);

  }

  handleChange(e) {
    e.preventDefault();
    let course = this.state.course;
    let key = e.target.name || e.target.id;
    course[key] = StringToType(e.target.value);
    this.setState({ course: course, dirty: true });
  }

  render() {

    const course = this.state.course;
    const title = course.course_title || "New Course";

    console.log("course", course);


    return (

      <section className="CourseDetail mt-3">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between">
            <h4>{title}</h4>
            <StatusIndicator loading={this.state.loading}
              dirty={this.state.dirty}
              className="pr-3" />
          </div>
          <div className="card-body">
            <form className="CourseForm" onSubmit={this.onSubmit}>
              <TextGroup onChange={this.handleChange} id="course_title" label="title" value={course.course_title} required />
              <TextGroup onChange={this.handleChange} id="course_num"  label="course number" value={course.course_num} required />
              <TextGroup onChange={this.handleChange} id="url" label="syllabus url" value={course.url} type="url" />
              <TextGroup onChange={this.handleChange} id="credits"
                label="credits"
                value={course.credits} type="number"
                min="0" max="6"
                valCols="col-md-2" />
              <RadioButtonGroup onChange={this.handleChange} id="required"
                value={course.required}
                label="course type"
                options={{"required":true,"elective":false}} />
              <div className="row mt-2">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                  <button className="btn btn-primary" type="submit">save</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    )
  }
}




export default CourseForm;
