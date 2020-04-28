import React from "react";
import _ from "lodash";
// import {DateTime} from "luxon";
import net from "./net.js";
import { StatusIndicator, StringToType } from "./ui/form-ui";
import PageSpinner from "./ui/PageSpinner";
import Toggle from "./ui/Toggle";
import  * as dates from "./ui/dates.js";
import {Online, International, CoursePlanningData} from "./CourseList";
import TermSchedule from "./TermSchedule";
import {Schedule} from "./TermSchedule";


class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
          plans: [],
        courses: [],
      schedules: [],
      students: [],
          dirty: false,
        loading: true
    };
    this.addSchedule = this.addSchedule.bind(this);

  }

  componentDidMount() {
    const store = ([plans, courses, schedules, students])=>  {
      courses = _.sortBy(courses.data, "course_num");
      // students = _.filter(students.data, s=>s.active && !s.graduated);
      // console.log("students", students.data);

      this.setState( {
        plans: plans.data,
        courses: courses,
        students: students.data,
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

  addSchedule() {
    let schedules = this.state.schedules;
    schedules = _.reverse(_.sortBy(schedules, "term"));
    console.log("adding schedule:", schedules);
    let term = dates.nextTerm();
    if (schedules.length) {
      term = dates.nextTerm(schedules[0].term);
    }

    let schedule = new Schedule(term);

    const saved = (response)=> {
      console.log("schedule posted:", response);
      schedule._id = response.data.insertedId;
      schedules = _.concat(schedules, schedule);
      // this.setState({schedules: schedules, loading: false});
      this.setState({schedules: schedules, loading: false});
    }
    const err = (e) => {
      console.log("failed to add new schedule:", e);
      this.setState({loading: false, error: "Failed to save changes. " + e.stack});
    }
    this.setState({ loading: true });

    console.log("saving schedule:", schedule);
    const url = "/api/schedules/";
    net.post(url, schedule).then(saved).catch(err);
  }


  render() {
    if (this.state.loading) {
      return (
        <PageSpinner msg="loading scheduling data" loading />
      )
    }

    let courses = this.state.courses;
    let schedules = this.state.schedules;
    schedules = _.reverse(_.sortBy(schedules, "term"));

    let plans = this.state.plans;

    const makeSchedule = (s, i) => {
      return (
        <TermSchedule key={s.term} open={i === 0} students={this.state.students} schedule={s} courses={courses} plans={plans} />
      )
    }

    return (

      <div className="mt-2 mb-2">
        <div className="d-flex">
          <h5 className="pb-0 mb-0">course scheduling</h5>
          <button className="btn btn-sm btn-primary ml-2 pt-0 pb-0" onClick={this.addSchedule}>add term</button>
        </div>
        { _.map(schedules, makeSchedule)  }

      </div>
    )
  }
}


export default ScheduleScreen;
