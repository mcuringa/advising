import React from "react";
import _ from "lodash";



class StudentsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
      loading: true
    };

  }

  componentWillMount() {
    const url = "/api/students";
    const loadStudents = (data)=> {
      this.setState({ students: data, loading: false });
    }
    fetch(url).then(r =>r.json()).then(loadStudents);
  }


  render() {
    const li = _.map(this.state.courses, StudentItem);
    return (
      <div>
        <h3>Students</h3>
        <ul>{li}</ul>
      </div>
    )
  }
}

function StudentItem(student)  {
  return (
    <li key={student.student_id}>str(student)</li>
  )
}

export default StudentsScreen;
