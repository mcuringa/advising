import React from "react";
import _ from "lodash";
// import {DateTime} from "luxon";
import net from "./net.js";
import { StatusIndicator, StringToType } from "./ui/form-ui";
import Toggle from "./ui/Toggle";
import  * as dates from "./ui/dates.js";
import CourseScheduleForm,  {ScheduledCourse} from "./CourseScheduleForm";
import {Person, AUIStudentIcon, OnlineStudentIcon, PlusSquareFill} from "./ui/icons";

function Schedule(term) {
  return {
    _id: null,
    term: term,
    courses: []
  }
}

class TermSchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: props.schedule,
      loading: false,
      dirty: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.deleteCourse = this.deleteCourse.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  save(newSchedule) {
    let schedule = newSchedule || this.state.schedule;

    const url = "/api/schedules/";
    const saved = ()=> {
      this.setState({dirty: false, loading: false});
    }
    const err = (e) => {
      console.log("failed to save schedule:", e);
      this.setState({loading: false, error: "Failed to save changes. " + e.stack});
    }
    this.setState({ loading: true });

    // console.log("saving schedule:", schedule);
    if (schedule._id) {
      net.put(url + schedule._id, schedule).then(saved).catch(err);
    }
    else {
      net.post(url, schedule).then(saved).catch(err);
    }
  }

  deleteCourse (course) {
    // console.log("deleting", course);
    let schedule = this.state.schedule;
    let courses = _.filter(schedule.courses, c=>c.course_id !== course.course_id);
    schedule.courses = courses;
    this.save(schedule);
  }

  saveCourse(course) {
    // console.log("saving course", course);
    let schedule = this.state.schedule;
    let courses = schedule.courses;

    const id = ()=> {
        const count = _.filter(courses, c=>c.course_num === course.course_num).length;
        return course.course_num + "-00" + (count + 1);
    }

    course.course_id = course.course_id || id();

    let i = _.findIndex(courses, c=>c.course_id === course.course_id);
    if (i === -1) {
      courses = _.concat(courses, course);
    }
    else {
      courses[i] = course;
    }
    // console.log("Saving courses:", courses);
    schedule.courses = courses;
    this.save(schedule);
  }

  handleChange(e) {
    e.preventDefault();
    let schedule = this.state.schedule;
    let key = e.target.name || e.target.id;
    schedule[key] = StringToType(e.target.value);
    this.setState({ schedule: schedule, dirty: true });
    this.save()
  }

  render() {
    const schedule = this.state.schedule;

    const Title = (
      <div className="d-flex justify-content-between flex-fill ">
        <strong>{dates.termName(schedule.term)}</strong>
        <StatusIndicator loading={this.state.loading}
          dirty={this.state.dirty}
          className="pr-3" />
      </div>
    );

    const show = this.props.open === true;
    const cf = (c)=> {
      let clone = _.clone(c);
      clone.course_id = null;
      const del = ()=> { this.deleteCourse(c) };
      return (<CourseScheduleForm
                allCourses={this.props.courses}
                key={_.uniqueId("csf_")}
                course={c}
                className="bg-light rounded p-1 pb-0 mb-1"
                save={this.saveCourse}
                delete={del} />)
    }
    const courses = _.map(schedule.courses, cf);
    return (
      <Toggle key={_.uniqueId("tsf_")} debug={schedule.term} css="card toggle-card-header"
        title={Title} open={show}>
        <div className="card-body">
          <Toggle title="Planned Courses" open>
            <PlannedCourses term={schedule.term} plans={this.props.plans} saveCourse={this.saveCourse} students={this.props.students} />
          </Toggle>
          <CourseScheduleForm allCourses={this.props.courses} className="bg-secondary p-1 rounded mb-1" key={_.uniqueId("newcourse_")} save={this.saveCourse} empty/>
          {courses}
        </div>
      </Toggle>
    );
  }
}

function PlannedCourses (props) {

  const students = _.keyBy(props.students, "student_id");
  // console.log("student db:", students);
  const term = props.term;
  const plans = props.plans;
  // const pf = (p)=> {
  //   return _.findIndex(p.courses, c=>c.term === term) !== -1;
  // }
  // const plansThisTerm = _.filter(plans, pf);
  // console.log("plans this term:", term, plansThisTerm);

  const plansToCourses = (t, p)=> {
    let courses = _.filter(p.courses, c=>c.term === term);
    return _.concat(t, courses);
  }

  const coursesToCourseData = (t, c)=> {
    // console.log("reducing:", c);
    let course = t[c.course_num];

    if (!course) {
      course = new ScheduledCourse();

      course = _.merge(course, _.pick(c, _.keys(course)));
      course.course_id = null;
      course.add = x=>{props.saveCourse(_.clone(course))}
      course.students = [];
      course.total = 0;
      course.aui = 0;
      course.online = 0;
    }
    let student = students[c.student_id];
    if (!student) {
      student = _.pick(c, ["student_id", "first", "last", "email", "major"]);
    }

    course.students = _.concat(course.students, student);

    course.total = course.total + 1;
    if (student.aui) {
      course.aui = course.aui + 1;
    }
    if (student.online) {
      course.online = course.online + 1;
    }
    t[c.course_num] = course;
    return t;
  }
  // flatten the course plans
  let plannedCourses = _.reduce(plans, plansToCourses, []);
  // console.log("courses this term:", term, plannedCourses);

  // group by course number, aggregate students
  let courseData = _.reduce(plannedCourses, coursesToCourseData, {});
  courseData = _.sortBy(_.values(courseData), "course_num");
  // console.log("reduced course students:", courseData[0].students);

  const PlannedCourseList = _.map(courseData, c=><PlannedCourse key={_.uniqueId("pcl_")} course={c} />);
  return (
    <ul className="list-group">{PlannedCourseList}</ul>
  )
}

function PlannedCourse (props) {
  const course = props.course;
  const title = (c)=> {
    return (
      <div className="">
        <span className="pr-1">{c.course_num} {c.course_title}</span>
        <span className="badge badge-pill badge-secondary"><Person /> {c.total}</span>
        <button className="btn btn-plain p-0 pl-1" onClick={c.add}><PlusSquareFill className="icon-primary" /></button>
      </div>
    )
  }
  let students = _.sortBy(course.students, "first");
  return (
    <li className="list-group-item p-0">
      <Toggle title={title(course)} plain>
          {_.map(students, s=><div className="pl-4" key={_.uniqueId("stuplan_")}><small>{s.first} {s.last} <AUIStudentIcon student={s} /> <OnlineStudentIcon student={s} /></small></div>)}
      </Toggle>
    </li>
  )
}

export default TermSchedule;
export {Schedule};
