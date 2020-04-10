import React from "react";
import net from "./net.js";
import { StatusIndicator, TextInput, Checkbox, LoadingSpinner } from "./ui/form-ui";
import Toggle from "./ui/Toggle";
import Plan from "./Plan";

class StudentDetail extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.match.params.id;
    this.state = {
      "student": {},
      "loading": true
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
    console.log("getting student", studUrl);
    net.get(studUrl).then(loadStudent);

  }

  render() {

    if (this.state.loading) {
      return <LoadingSpinner loading />
    }
    const student = this.state.student;
    const title = (<h3>{this.state.student.first} {this.state.student.last}</h3>);
    console.log("student", student);
    console.log("student_id", student.student_id);


    return (

      <section className="StudentDetail mt-3">
        <div className="mb-2">
          <Toggle css="card toggle-card-header" open={false}
              title={title}>

            <div className="card-body">
              <StudentForm student={student} />
            </div>
          </Toggle>
        </div>

        <Plan student_id={student.student_id} />
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

  onSubmit(e) {
    e.preventDefault();
    let student = this.state.student;
    if(student.graduated) {
      student.active = false;
    }
    const url = "/api/students/" + student._id;
    const saved = ()=> {
      this.setState({dirty: false, loading: false});
    }
    this.setState({ loading: true });
    net.put(url, student).then(saved).catch((e)=>{
      console.log("failed to save student:", e);
      this.setState({loading: false, error: "Failed to save changes. " + e.stack});
    });
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
    const CLASS = "https://class.adelphi.edu/cgi-bin/web.asp?web=ADVISEE.INQ&STUDID=" + student.student_id;
    const slate = "https://connect.adelphi.edu/manage/lookup/search?q=" + student.first + "+" + student.last;
    const degree = "https://studentweb.adelphi.edu/selfservice-batch/audit/create.html?searchType=stuno&stuno=" + student.student_id;

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
          <div className="col-md-6">
            {student.student_id}
            <a className="pl-2" href={CLASS} title="open in CLASS">[CLASS]</a>
            <a className="pl-2" href={slate} title="open in Slate">[Slate]</a>
            <a className="pl-2" href={degree} title="open in degree audit">[Degree Audit]</a>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-md-3 text-right font-weight-bold">
            email
          </div>
          <div className="col-md-6">
            <a href={`mailto:${student.email}`} title="send an email"><span role="img" aria-label="email">📧</span> {student.email}</a>
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
