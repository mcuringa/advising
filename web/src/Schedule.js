import React from "react";
import _ from "lodash";
// import {DateTime} from "luxon";
import net from "./net.js";
import { LoadingSpinner, StatusIndicator, StringToType } from "./ui/form-ui";
import Toggle from "./ui/Toggle";
import  * as dates from "./ui/dates.js";
import {Online, International, CoursePlanningData} from "./CourseList";
import CourseScheduleForm from "./CourseScheduleForm";


class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          plans: [],
        courses: [],
      schedules: [],
      students: {},
          dirty: false,
        loading: true
    };
  }

  componentDidMount() {
    const store = ([plans, courses, schedules, students])=>  {
      courses = _.sortBy(courses.data, "course_num");
      students = _.filter(students.data, s=>s.active && !s.graduated);

      this.setState( {
        plans: plans.data,
        courses: courses,
        schedules: schedules.data || [],
        loading: false
      });
    }
    const promises = [
      net.get("/api/plans"),
      net.get("/api/courses"),
      net.get("/api/schedules"),
      net.get("/api/students")
    ];

    Promise.all(promises).then(store);
  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner loading />
    }
    let courses = this.state.courses;
    let schedules = this.state.schedules;
    schedules = _.reverse(_.sortBy(schedules, "term"));
    let plans = this.state.plans;

    const addSchedule = ()=> {
      let term = dates.nextTerm();
      if (schedules.length) {
        term = dates.nextTerm(schedules[0].term);
      }
      schedules = _.concat(schedules, new Schedule(term));
      this.setState({schedules: schedules});
    }

    console.log("schedules:", schedules);
    const makeSchedule = (s, i) => {
      return (
        <ScheduleForm key={s.term} open={i === 0} schedule={s} courses={courses} plans={plans} />
      )
    }

    return (


      <div className="mt-2 mb-2">
        <div className="d-flex">
          <h5 className="pb-0 mb-0">course scheduling</h5>
          <button className="btn btn-sm btn-primary ml-2 pt-0 pb-0" onClick={addSchedule}>add term</button>
        </div>
        { _.map(schedules, makeSchedule)  }

      </div>
    )
  }
}


// function CourseList (props) {
//   const schedule = props.schedule;
//   let planned = _.filter(props.reg, r=>r.term === schedule.term);
//   let total = planned.length;
//   // let aui =
//   const CourseList = _.map(planned, (c,i)=><CourseItem course={c} i={String(i)} />)
//
//   return (
//     <div className="PlannedCourses">
//       {CourseList}
//     </div>
//   )
// }
//
// function CourseSymbol (props) {
//   if (props.course.required) {
//     return (<span className="RequiredCourse text-primary pl-1 pr-1">✓</span>);
//   }
//   return (<span className="ElectiveCourse text-success pl-1 pr-1">★</span>);
// }
//
// function CourseItem(course, i)  {
//   let css = "";
//   return (
//     <div key={i} className={`CourseItem list-group-item ${css}`} data-course_num={course.course_num}>
//       <span className="pl-2 pt-1">{course.course_num} {course.course_title}</span>
//       <CourseSymbol course={course} /> ({course.credits})
//     </div>
//   )
// }

function Schedule(term) {
  return {
    _id: null,
    term: term,
    courses: []
  }
}

class ScheduleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule: props.schedule,
      loading: false,
      dirty: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
  }

  save() {
    let schedule = this.state.schedule;

    const url = "/api/schedules/";
    const saved = ()=> {
      this.setState({dirty: false, loading: false});
    }
    const err = (e) => {
      console.log("failed to save schedule:", e);
      this.setState({loading: false, error: "Failed to save changes. " + e.stack});
    }
    this.setState({ loading: true });

    console.log("saving schedule:", schedule);
    if (schedule._id) {
      net.put(url + schedule._id, schedule).then(saved).catch(err);
    }
    else {
      net.post(url, schedule).then(saved).catch(err);
    }
  }

  saveCourse(course) {
    let schedule = this.state.schedule;
    let courses = schedule.courses;
    let i = _.findIndex(courses, c=>c.course_num === course.course_num);
    if (i === -1) {
      courses = _.concat(courses, course);
    }
    else {
      courses[i] = course;
    }
    console.log("Saving courses:", courses);
    schedule.courses = courses;
    this.setState({schedule: schedule, dirty: true});
    this.save();
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
    const courses = _.map(schedule.courses, c=><CourseScheduleForm key={c.course_num} save={this.saveCourse} course={c}/>);
    return (
      <Toggle key={schedule.term} debug={schedule.term} css="card mb-2 toggle-card-header"
        title={Title} open={show}>
        <div className="card-body">
          <CourseScheduleForm className="bg-dark p-2 rounded" key="new" save={this.saveCourse} empty/>
          {courses}
        </div>
      </Toggle>

    );
  }
}


export default ScheduleScreen;
