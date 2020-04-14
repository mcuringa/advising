import {DateTime} from "luxon";

function nextTerm(term) {
  if (!term) {
    term = DateTime.local();
  }
  else {
    console.log("term string: " +  term);
    term = DateTime.fromString(term,"yy/LL");
    console.log("term: " +  term.toFormat("LL/dd/yyyy"));
  }

  let spring = term.set({month:2, day: 1});
  const summer = term.set({month:5, day: 1});
  const fall = term.set({month:9, day: 1});


  if (term >= fall) {
    return spring.plus({year:1}).toFormat("yy/LL");
  }

  if (term < spring) {
    return spring.toFormat("yy/LL");
  }

  if (term < summer) {
    return summer.toFormat("yy/LL");
  }

  return fall.toFormat("yy/LL");
}

function termName (term) {
  const semesters = {
    "02": "Spring",
    "05": "Summer",
    "06": "Summer",
    "09": "Fall"
  }
  let [year, month] = term.split("/");
  return `${semesters[month]} 20${year}`;
}

// eslint-disable-next-line
function test() {
  console.log("20/05", nextTerm());
  console.log("20/05", nextTerm("20/02"));
  console.log("20/09", nextTerm("20/05"));
  console.log("21/02", nextTerm("20/09"));
  console.log("15/05", nextTerm("15/02"));
  console.log("16/02", nextTerm("15/12"));
}

export { nextTerm, termName };
