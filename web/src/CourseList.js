import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import { DateTime as dt } from "luxon";
import net from "./net.js";
import Toggle from "./ui/Toggle";

class CourseScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };

  }

  componentDidMount() {
    const courseUrl = "/api/courses";
    const planUrl = "/api/plans";
    const studentUrl = "/api/students"

    const store = ([courses, plans, students])=>  {
      courses = courses.data;
      plans = plans.data;
      students = _.filter(students.data, s=>s.active && !s.graduated);
      const studentMap = _.keyBy(students, s=>s.student_id);
      const studentIds = _.keys(studentMap);
      plans = _.filter(plans, p=>_.includes(studentIds, p.student_id))
      courses = _.sortBy(courses, "course_num");
      const requiredCourses = _.filter(courses, c=>c.required) ;
      const electives = _.filter(courses, c=>!c.required && c.course_num !== "858-791") ;

      this.setState( {
        plans: plans,
        electives: electives,
        requiredCourses: requiredCourses,
        students: studentMap,
        loading: false
      });
      console.log("state", this.state);
    }

    Promise.all([net.get(courseUrl), net.get(planUrl), net.get(studentUrl)]).then(store);

  }


  render() {
    const detail = c=><CourseDetail key={c._id} course={c} students={this.state.students} plans={this.state.plans} />
    const required = _.map(this.state.requiredCourses, detail);
    const electives = _.map(this.state.electives, detail);
    return (
      <div>
        <h3>Required Courses</h3>
        {required}
        <h3>Electives</h3>
        {electives}
      </div>
    )
  }
}

function CourseDetail (props) {
  let course = props.course;
  let plans = props.plans;

  const now = dt.local();
  let isCompleted = (c)=> {
    if(c.course_num !== course.course_num) {
      return false;
    }
    let sub = dt.fromString(c.term, "yy/LL") < now;
    return c.completed || sub;
  }
  let filterCompleted = (p) => {
    let x = _.filter(p.courses, isCompleted);
    return x.length > 0;
  }
  let completed = _.filter(plans, filterCompleted);
  let need = _.difference(plans, completed);
  let students = _.map(need, s=>props.students[s.student_id]);
  students = _.sortBy(students, s=>!s.aui + " " + s.first);

  return (
    <Toggle title={<CourseLink course={course} need={plans.length - completed.length} />}>
      <ol>{_.map(students, StudentListItem)}</ol>
    </Toggle>
  )
}

function StudentListItem (s) {

  return (
    <li key={s._id}>
      <Link to={`/students/${s._id}`}>{s.first} {s.last}<International student={s} /><Online student={s} /></Link>
    </li>
  )
}

function International (props) {
  if (props.student.aui) {
    return <span className="pl-1 pr-1" role="img" aria-label="international">🇺🇳</span>;
  }
  return null;
}

function Online (props) {
  if (props.student.online) {
    return <span className="pl-1 pr-1" role="img" aria-label="online student">📡</span>;
  }
  return null;
}

function CourseLink (props) {
  let verb = ()=> {
    if(props.course.required) {
      if (props.need === 1) {
        return "student needs";
      }
      return "students need";
    }

    if (props.need === 1) {
      return "student hasn't taken";
    }
    return "students haven't taken";

  }
  let need = (<small className="pl-1">{props.need} {verb()} course</small>);

  return (
    <div>
      <Link to={`/courses/${props.course._id}`}>{props.course.course_title}</Link>
      {need}
    </div>
  )
}


export default CourseScreen;
