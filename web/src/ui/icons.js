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
      <svg className="bi bi-envelope-fill" width="1em" height="1em" viewBox="0 0 16 16" fill={fill}  xmlns="http://www.w3.org/2000/svg">
        <path d="M.05 3.555L8 8.414l7.95-4.859A2 2 0 0014 2H2A2 2 0 00.05 3.555zM16 4.697l-5.875 3.59L16 11.743V4.697zm-.168 8.108L9.157 8.879 8 9.586l-1.157-.707-6.675 3.926A2 2 0 002 14h12a2 2 0 001.832-1.195zM0 11.743l5.875-3.456L0 4.697v7.046z"/>
      </svg>
    </span>
  )
}

function OctogonFill (props) {

  return (
    <span className={props.className}>
      <svg className="bi bi-octagon-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.107 0a.5.5 0 01.353.146l4.394 4.394a.5.5 0 01.146.353v6.214a.5.5 0 01-.146.353l-4.394 4.394a.5.5 0 01-.353.146H4.893a.5.5 0 01-.353-.146L.146 11.46A.5.5 0 010 11.107V4.893a.5.5 0 01.146-.353L4.54.146A.5.5 0 014.893 0h6.214z"/>
      </svg>
    </span>
  )
}

function SaveIcon (props) {


  return (
    <span className={props.className}>
      <svg className="bi bi-cloud-upload" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.887 6.2l-.964-.165A2.5 2.5 0 103.5 11H6v1H3.5a3.5 3.5 0 11.59-6.95 5.002 5.002 0 119.804 1.98A2.501 2.501 0 0113.5 12H10v-1h3.5a1.5 1.5 0 00.237-2.981L12.7 7.854l.216-1.028a4 4 0 10-7.843-1.587l-.185.96z"/>
        <path fillRule="evenodd" d="M5 8.854a.5.5 0 00.707 0L8 6.56l2.293 2.293A.5.5 0 1011 8.146L8.354 5.5a.5.5 0 00-.708 0L5 8.146a.5.5 0 000 .708z" clipRule="evenodd"/>
        <path fillRule="evenodd" d="M8 6a.5.5 0 01.5.5v8a.5.5 0 01-1 0v-8A.5.5 0 018 6z" clipRule="evenodd"/>
      </svg>
    </span>
  )
}

function DeleteIcon (props) {


  return (
    <span className={props.className}>
      <svg className="bi bi-x-octagon-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentFill" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" className="icon-danger" d="M11.46.146A.5.5 0 0011.107 0H4.893a.5.5 0 00-.353.146L.146 4.54A.5.5 0 000 4.893v6.214a.5.5 0 00.146.353l4.394 4.394a.5.5 0 00.353.146h6.214a.5.5 0 00.353-.146l4.394-4.394a.5.5 0 00.146-.353V4.893a.5.5 0 00-.146-.353L11.46.146zm.394 4.708a.5.5 0 00-.708-.708L8 7.293 4.854 4.146a.5.5 0 10-.708.708L7.293 8l-3.147 3.146a.5.5 0 00.708.708L8 8.707l3.146 3.147a.5.5 0 00.708-.708L8.707 8l3.147-3.146z" clipRule="evenodd"/>
      </svg>
    </span>
  )
}

function Person (props) {

  return (
    <span className={props.className}>
      <svg className="bi bi-person-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
      </svg>
    </span>
  )
}

function PlusSquareFill (props) {

  return (
    <span className={props.className}>
      <svg className="bi bi-plus-square-fill" width="1.25em" height="1.25em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M2 0a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2H2zm6.5 4a.5.5 0 00-1 0v3.5H4a.5.5 0 000 1h3.5V12a.5.5 0 001 0V8.5H12a.5.5 0 000-1H8.5V4z" clipRule="evenodd"/>
      </svg>
    </span>
  )
}

function UNFlag (props) {
  return <span className="pl-1 pr-1" style={{fontSize:"1.25em"}} role="img" aria-label="international">🇺🇳</span>;
}

function Globe (props) {
  return <span className="pl-1 pr-1" role="img" aria-label="international">🌏</span>;
}

function Network (props) {
  return <span className="pl-1 pr-1" role="img" aria-label="computer network">🖧</span>;
}


function OnlineStudentIcon (props) {
  let s = props.student;
  if (!s.online) {
    return null;
  }
  return Network();

}

function AUIStudentIcon (props) {
  let s = props.student;
  if (!s.aui) {
    return null;
  }
  return Globe();

}

export {
  CaretFillDown,
  CaretFillRight,
  EnvelopeFill,
  OctogonFill,
  DeleteIcon,
  SaveIcon,
  Person,
  PlusSquareFill,
  UNFlag,
  AUIStudentIcon,
  OnlineStudentIcon
};
