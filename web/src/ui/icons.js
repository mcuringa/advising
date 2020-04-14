import React from "react";
import "./icons.css";

function CaretFillRight (props) {

  const fill = props.fill || "currentFill";


  return (
    <span className={props.className}>
      <svg className="bi bi-caret-right-fill" width="1em" height="1em" viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 011.659-.753l5.48 4.796a1 1 0 010 1.506z"/>
      </svg>
    </span>
  )
}

function CaretFillDown (props) {

  const fill = props.fill || "currentFill";

  return (
    <span className={props.className}>
      <svg className="bi bi-caret-down-fill" width="1em" height="1em" viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
        <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 01.753 1.659l-4.796 5.48a1 1 0 01-1.506 0z"/>
      </svg>
    </span>
  )
}

function EnvelopeFill (props) {

  const fill = props.fill || "currentFill";

  return (
    <span className={props.className}>
      <svg className="bi bi-envelope-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M.05 3.555L8 8.414l7.95-4.859A2 2 0 0014 2H2A2 2 0 00.05 3.555zM16 4.697l-5.875 3.59L16 11.743V4.697zm-.168 8.108L9.157 8.879 8 9.586l-1.157-.707-6.675 3.926A2 2 0 002 14h12a2 2 0 001.832-1.195zM0 11.743l5.875-3.456L0 4.697v7.046z"/>
      </svg>
    </span>
  )
}


export { CaretFillDown, CaretFillRight, EnvelopeFill };
