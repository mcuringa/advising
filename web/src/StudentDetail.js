import React from "react";
import net from "./net.js";
import { StatusIndicator, TextInput, Checkbox } from "./ui/form-ui";
import PageSpinner from "./ui/PageSpinner";
import Toggle from "./ui/Toggle";
import Plan from "./Plan";
import classNames from "classnames";
import _ from "lodash";


function StudentPlan(s) {
  const fields = [
    "student_id",
    "last",
    "major",
    "first",
    "email"
  ]
  let plan = _.pick(s, fields);
  plan.courses = [];
  return plan
}


function Student() {
  return {
    _id: null,
    student_id: "",
    first: "",
    last: "",
    email: "",
    major: "EDX",
    aui: false,
    last_registered: "",
    online: true,
    graduated: false,
    active: true
  }
}

class StudentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      "student": new Student(),
      "loading": this.id
      };
  }

  componentDidMount() {

    const loadStudent = (response)=> {
      const student = response.data;
      this.setState( {
        student: student,
        loading: false
      });
    }
    // load the data
    const studUrl = "/api/students/" + this.id;
    if (this.id){
      console.log("getting student", studUrl);
      net.get(studUrl).then(loadStudent);
    }
    else {
      console.log("new student")
    }

  }

  componentDidUpdate(prevProps) {
    // console.log("update ==========================================")
    // console.log("this.props", this.props);
    // console.log("prevProps", prevProps);
    if (this.props.path == "/students/new" && this.props.path != prevProps.path) {
      console.log("switching to new student")
      this.setState( {
        "student": new Student(),
        "loading": false
        });
    }
  }


  render() {

    if (this.state.loading) {
      return <PageSpinner msg="loading student details" loading />
    }
    const student = this.state.student;
    const title = (<h3>{this.state.student.first} {this.state.student.last}</h3>);
    console.log("student", student);
    console.log("student_id", student.student_id);


    const plan = (!student._id)?null:(<Plan student={student} student_id={student.student_id} />);


    return (

      <section className="StudentDetail mt-3">
        <div className="mb-2">
          <Toggle css="card toggle-card-header" open={!student._id} title={title}>
            <div className="card-body">
              <StudentForm student={student} />
            </div>
          </Toggle>
        </div>

        {plan}
      </section>
    )
  }
}


class StudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student: props.student,
      loading: false,
      dirty: false,
      error: null

    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  componentDidUpdate(prevProps) {
    if (this.props.student._id  != prevProps.student._id) {
      console.log("clearing form data")
      this.setState( {
        student: this.props.student,
        loading: false,
        dirty: false,
        error: null
        });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    let student = this.state.student;
    if(student.graduated) {
      student.active = false;
    }

    const saved = ()=> {
      this.setState({dirty: false, loading: false});
    }
    this.setState({ loading: true });
    if (student._id){
      const url = "/api/students/" + student._id;
      net.put(url, student).then(saved).catch((e)=> {
        console.log("failed to save student:", e);
        this.setState({loading: false, error: "Failed to save changes. " + e.stack});
      });
    }
    else {
      // new student

      let plan = new StudentPlan(student)
      let sUrl = "/api/students/";
      let pUrl = "/api/plans/";
      const err = (e)=> {
        this.setState({loading: false, error: "Failed to create student. " + e.stack});
      }
      let sp = net.post(sUrl, student).then(saved).catch(err);
      let pp = net.post(pUrl, plan).then(saved).catch(err);
    }
  }

  handleChange(e) {
    console.log("handing change");
    e.preventDefault();
    let student = this.state.student;
    student[e.target.id] = e.target.value;
    this.setState({ student: student, dirty: true });
  }

  render () {
    let student = this.state.student;
    let linkCss = classNames("pl-2", {"text-secondary": !student._id})


    const CLASS = (student._id)?"https://class.adelphi.edu/cgi-bin/web.asp?web=ADVISEE.INQ&STUDID=" + student.student_id:"#";
    const slate =  (student._id)?"https://connect.adelphi.edu/manage/lookup/search?q=" + student.first + "+" + student.last:"#";
    const degree = (student._id)?"https://studentweb.adelphi.edu/selfservice-batch/audit/create.html?searchType=stuno&stuno=" + student.student_id:"#";
    const mailto = (student._id)?"mailto:" + student.email:"#";

    const toggle = (key)=> {
      return ()=> {
        student[key] = !student[key];
        this.setState({student: student, dirty: true});
      }
    }

    return (
      <form onSubmit={this.onSubmit}>
        <div className="d-flex justify-content-end">
          <StatusIndicator loading={this.state.loading}
            dirty={this.state.dirty}
            className="pr-3" />
        </div>

        <div className="row mb-2">
          <div className="col-md-3 text-right font-weight-bold">
            name
          </div>
          <div className="col-md-3">
            <TextInput
              id="first"
              required
              validationErrorMsg="first name is required"
              validationPassedMsg="looks good"
              placeholder="first name"
              value={student.first}
              onChange={this.handleChange} />
          </div>
          <div className="col-md-3">
            <TextInput
            id="last"
            required
            validationErrorMsg="last name is required"
            validationPassedMsg="looks good"
            placeholder="last name"
            value={student.last}
            onChange={this.handleChange} />
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-3 text-right font-weight-bold">
            student id
          </div>
          <div className="col-md-3">
            <TextInput
              id="student_id"
              required
              validationErrorMsg="must enter a student id"
              validationPassedMsg="looks good"
              placeholder="au student id"
              value={student.student_id}
              plaintext={student._id}
              onChange={this.handleChange} />
            </div>
            <div className="col-md-3">
            <a className={linkCss} href={CLASS} title="open in CLASS">[CLASS]</a>
            <a className={linkCss} href={slate} title="open in Slate">[Slate]</a>
            <a className={linkCss} href={degree} title="open in degree audit">[Degree Audit]</a>
            <a className={linkCss} href={mailto} title="send email to student">[email]</a>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-3 text-right font-weight-bold">
            email
          </div>
          <div className="col-md-6">
            <TextInput
              id="email"
              required
              validationErrorMsg="all students need valid email"
              validationPassedMsg="looks good"
              placeholder="mail.adelphi.edu email"
              value={student.email}
              onChange={this.handleChange} />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <Checkbox label="AUI" checked={student.aui} onClick={toggle("aui")} />
              </div>
              <div className="col-md-6">
                <Checkbox label="Online / AllCampus" checked={student.online} onClick={toggle("online")} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Checkbox label="Graduated" checked={student.graduated} onClick={toggle("graduated")} />
              </div>
              <div className="col-md-6">
                <Checkbox label="Inactive" checked={!student.active} onClick={toggle("active")} />
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <button className="btn btn-primary" type="submit">save</button>
          </div>
        </div>
      </form>
    )
  }
}


export default StudentDetail;
