import React from "react";
import _ from "lodash";
import Sortable from 'sortablejs';
import  * as dates from "./ui/dates.js";
// import { Link } from "react-router-dom";

import net from "./net.js";
import { LoadingSpinner } from "./ui/form-ui";
import "./Drag.css";
import {DateTime} from "luxon";

class Plan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
         plan: {},
      courses: [],
        dirty: false,
      loading: true,
      electives: [],
      required: []
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.calcCoursedNeeded = this.calcCoursedNeeded.bind(this);

  }

  componentDidMount() {
    const store = ([plans, courses])=>  {
      console.log("got plan", plans.data[0]);
      courses = _.sortBy(courses.data, "course_num");
      let plan = plans.data[0];
      let [required, electives] = this.calcCoursedNeeded(plan);
      console.log("required,electives", required, electives);

      this.setState( {
        plan: plan,
        required: required,
        electives: electives,
        courses: courses,
        loading: false
      });
    }

    const planUrl = "/api/plans?student_id=" + this.props.student_id;
    Promise.all([net.get(planUrl), net.get("/api/courses")]).then(store);
  }

  componentDidUpdate() {
    let courses = document.getElementById('CourseList');

    const courseOptions = {
      handle: ".drag-handle",
      dragClass: "bg-primary",
      animation: 100,
      onEnd: this.onDragEnd,
      group: {
        name: "courses",
        pull: true,
        put: true
      }
    };
    Sortable.create(courses, courseOptions);

    let terms = document.getElementsByClassName("TermList");
    terms = _.map(terms, t=>t.id);
    console.log("got some terms:", terms);

    const makeSortableTerm = (term)=> {
      const el = document.getElementById(term);
      const opts = {
        handle: ".drag-handle",
        dragClass: "bg-primary",
        animation: 100,
        onEnd: this.onDragEnd,
        group: {name: term, put: true, pull: true}
      };
      // console.log("make sort,", opts);
      return Sortable.create(el, opts);
    }
    _.map(terms, makeSortableTerm);

  }

  calcCoursedNeeded(plan) {
    let electives = _.reduce(_.filter(plan.courses,c=>!c.required),(x,c)=>x+Number(c.credits)||0, 0);
    let required = _.reduce(_.filter(plan.courses,c=>c.required),(x,c)=>x+Number(c.credits)||0, 0);
    return [required, electives];
  }

  onDragEnd (evt) {
    const studentInfo = _.pick(this.props.student, ["student_id", "first", "last"]);
    let plan = this.state.plan;
    let planCourses = plan.courses;
    let courses = this.state.courses;
    let course_num = evt.item.dataset.course_num;
    let from = evt.from.id;
    let to = evt.to.id;

    let index = _.findIndex(plan.courses,c=>c.course_num === course_num);

    if (from === "CourseList") { // from course list to a term
      let course = _.clone(_.find(courses,c=>c.course_num === course_num));
      course.term = to;
      // console.log("student info:", studentInfo);
      course = _.merge(course, studentInfo);
      // console.log("course info:", course);
      planCourses = _.concat(planCourses, course);
    }
    else if (to === "CourseList") { // to course list (remove course)
      _.pullAt(planCourses, [index]);
    }
    else { // change term
      if (index > -1) {
        planCourses[index].term = to;
      }
    }

    plan.courses = planCourses;

    const saved = (r)=> {
      console.log("saved plan with result:", r);
      const [required, electives] = this.calcCoursedNeeded(plan);
      // can't update state b/c DOM isn't stable...just cheat
      document.getElementById("ReqCredits").innerHTML = required;
      if (required > 23) {
        document.getElementById("ReqCredits").className = "text-danger";
      }
      document.getElementById("ElectCredits").innerHTML = electives;
      if (electives > 9) {
        document.getElementById("ElectCredits").className = "text-danger";
      }
      document.getElementById("TotalCredits").innerHTML = required + electives;
      if (required + electives > 32) {
        document.getElementById("TotalCredits").className = "text-danger";
      }
    }
    const url = "/api/plans/" + plan._id;
    net.put(url, plan).then(saved).catch((e)=>{
      console.log("failed to save plan:", e);
    });

  }

  render() {
    if (this.state.loading) {
      return <LoadingSpinner loading />
    }
    let plannedCourses = _.map(this.state.plan.courses, c=>c.course_num);
    let courses = this.state.courses;
    let terms = addNextTerms(this.state.plan, 5);
    courses = _.filter(courses, c=>!_.includes(plannedCourses, c.course_num));
    const modified = DateTime.fromISO(this.state.plan.modified).toRelative();

    return (

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center border-bottom">
            <h5 className="pb-0 mb-1">plan of study</h5>
            <small className="text-muted d-block ml-1">modified: {modified}</small>
          </div>
          <PlanHeader electives={this.state.electives} required={this.state.required} />
          <PlanOfStudy courses={this.state.plan.courses} terms={terms} />
        </div>
        <div className="col-md-6">
          <h5 className="border-bottom pb-1">courses</h5>
          <CourseList courses={courses} />
        </div>
      </div>
    )
  }
}

/**
 * get the next 4 terms
 * @param plan the current plan of plan of study
 * @param count the number of future terms to create
 * @return an array of strings with keys for the
 * next `count` terms (including the current term in progress)
 */
function addNextTerms (plan, count) {

  let terms = new Set(_.map(plan.courses,c=>c.term));
  let term = dates.nextTerm();

  for (let i = 0; i < count; i++) {
    terms.add(term);
    term = dates.nextTerm(term);

  }
  return Array.from(terms);
}


function CourseList (props) {

  const CourseList = _.map(props.courses, CourseItem)

  return (
    <div id="CourseList">
      {CourseList}
    </div>
  )
}

function CourseSymbol (props) {
  if (props.course.required) {
    return (<span className="RequiredCourse text-primary pl-1 pr-1">✓</span>);
  }
  return (<span className="ElectiveCourse text-success pl-1 pr-1">★</span>);
}

function CourseItem(course, i)  {
  let css = "";
  let handle = (<span className="drag-handle">⣿</span>);
  if (course.completed) {
    css = "completed font-italic";
    // handle = null; //hides the handle for completed courses
  }
  return (
    <div key={i} className={`CourseItem drag-item list-group-item ${css}`} data-course_num={course.course_num}>
      {handle}
      <span className="pl-2 pt-1">{course.course_num} {course.course_title}</span>
      <CourseSymbol course={course} /> ({course.credits})
    </div>
  )
}

function PlanHeader (props) {
    return (
      <div>
        <small>required: <span id="ReqCredits">{props.required}</span> / 23
        | electives: <span id="ElectCredits">{props.electives}</span> / 9
        | total: <span id="TotalCredits">{props.electives + props.required}</span> / 32</small>
      </div>
    )
}

function PlanOfStudy (props) {

  let terms = props.terms;
  // sort the dict into array of terms (reverse chron)
  terms.sort();
  terms.reverse();
  let termCourseLists = [];
  for(let term of terms) {
    let courses = _.filter(props.courses, c=>c.term === term);
    termCourseLists.push(<Term key={term} term={term} courses={courses} />)
  }

  return (
    <div>
      {termCourseLists}
    </div>
  )
}

function Term (props) {

  const termName = (term)=> {
    const semesters = {
      "02": "Spring",
      "05": "Summer",
      "06": "Summer",
      "09": "Fall"
    }
    let [year, month] = term.split("/");
    return `${semesters[month]} 20${year}`;
  }

  return (
    <div className="Term" key={props.term}>
      <strong>{termName(props.term)}</strong>
      <div id={props.term} className="TermList list-group">
        {_.map(props.courses, CourseItem)}
      </div>
    </div>
  )
}



export default Plan;
