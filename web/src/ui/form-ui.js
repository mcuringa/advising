import React from "react";
import _ from "lodash";
import {DateTime as dt } from "luxon";

const LoadingSpinner = (props)=> {
  if (!props.loading) {
    return null;
  }
  // const msg = props.msg || "loading..."
  return (
    <div className="spinner-grow spinner-grow-sm" role="status">
      <span className="sr-only">Loading...</span>
    </div>
    );
}

const StatusIndicator = (props)=> {
  let clazz = "text-success";
  let icon = "◆";
  if (props.dirty) {
    icon = "◈";
    clazz = "text-warning";
  }
  if(props.loading) {
    clazz += " d-none";
  }
  return (
    <div className={props.className}>
      <span className={clazz}>{icon}</span>
      <LoadingSpinner loading={props.loading} />
    </div>
  );
}


const Checkbox = (props)=> {
  if(props.hide) {
    return null;
  }
  const extraCss = props.className || "";

  return (
    <div className="form-group">
      <div className="form-check">
        <input type="checkbox"
          value={props.value}
          className={`form-check-input ${extraCss}`}
          id={props.id}
          name={props.id}
          checked={props.checked}
          required={props.required}
          onChange={props.onClick} />
        <label className="form-check-label font-weight-normal" htmlFor={props.id}>{props.label}</label>
        <InvalidMsg msg={props.validationErrorMsg} />
        <ValidMsg msg={props.validationPassedMsg} />
      </div>
    </div>
  )
}

const Label = (props)=>{
  if(!props.label)
    return null;
  return (<label className="font-weight-bold" htmlFor={props.id}>{props.label}</label>)
}


const TextGroup = (props)=> {

  if(props.hide){
    return null;
  }
  const labelCols = props.labelCols || "col-md-3";
  const valCols = props.valCols || "col-md-9";
  let {type, ...inputProps} = props;

  return (
    <div className="form-group row">
      <div className={`text-right ${labelCols}`}>
        <Label id={props.id} label={props.label} />
      </div>
      <div className={valCols}>
        <TextInput type={type||'text'}
          {...inputProps} />
      </div>
      <small id={`${props.id}Help`} className="form-text text-muted">{props.help}</small>
      <InvalidMsg msg={props.validationErrorMsg} />
      <ValidMsg msg={props.validationPassedMsg} />

    </div>
  );
};

const InvalidMsg = (props)=>{
  if(!props.msg || props.msg.length === 0)
    return null;
  return (
      <div className="invalid-feedback">{props.msg}</div>
  )
}

const ValidMsg = (props)=>{
  if(!props.msg || props.msg.length === 0)
    return null;
  return (
      <div className="valid-feedback">{props.msg}</div>
  )
}

const TextInput = (props)=> {

  if(props.hide) {
    return null;
  }

  if (props.plaintext) {
    return (<div className="text-left">{props.value}</div>);
  }
  const pt = (props.plaintext && props.readOnly)?"-plaintext":"";
  const validationCss = props.validationCss || "";
  let css = props.className || "";
  if (props.plaintext) {
    css += " align-top";
  }

  const required = StringToType(props.required) === true;
  return (

    <input type={props.type||'text'}
           value={props.value}
           className={`form-control${pt} ${css} ${validationCss}`}
           id={props.id}
           min={props.min}
           max={props.max}
           placeholder={props.placeholder}
           onChange={props.onChange}
           readOnly={props.readOnly}
           required={required}
           autoFocus={props.autofocus} />
  );
};


const TextAreaGroup = (props)=> {
  if(props.hide)
    return null;

  return (
    <div className="form-group">
      <Label id={props.id} label={props.label}/>
      <textarea id={props.id}
        className="form-control"
        onChange={props.onChange}
        rows={props.rows || 4}
        placeholder={props.placeholder}
        value={props.value}
        readOnly={props.readonly}
        required={props.required} />
      <small id={`${props.id}Help`} className="form-text text-muted">{props.help}</small>
      <InvalidMsg msg={props.validationErrorMsg} />
      <ValidMsg msg={props.validatinPassedMsg} />
    </div>
  );
};

const RadioButtonGroup = (props)=>
{

  if(props.hide) {
    return null;
  }

  let value = StringToType(props.value);

  let radios = _.map(props.options, (v, k)=> {
    const checked= value === v;
    return (
      <RadioButton
        key={`${props.id}.${k}`}
        id={`${props.id}.${k}`}
        name={props.id}
        checked={checked}
        value={v}
        label={k}
        disabled={props.readOnly}
        onChange={props.onChange}
      />
      );
  });

  const labelCols = props.labelCols || "col-md-3";
  const valCols = props.valCols || "col-md-6";

  const GroupLabel = (!props.label)?null: (
      <div className={`text-right ${labelCols}`}>
        <Label id={props.id} label={props.label} />
      </div>
    );

  return(
    <div className="form-group row">
      {GroupLabel}
      <div className={`${valCols}`}>
        <small id={`${props.id}Help`} className="form-text text-muted">{props.help}</small>
        {radios}
      </div>
    </div>
    );
}

const RadioButton = (props)=>
{
  return(
    <div className="form-check">
      <input id={props.id}
        className="form-check-input"
        type="radio"
        checked={props.checked}
        name={props.name}
        value={props.value}
        autoComplete="off"
        onChange={props.onChange} />
        <label className="form-check-label font-weight-normal" htmlFor={props.id}>{props.label}</label>
    </div>

  );
}

const StringToType = (v)=> {
  if (typeof v !== "string") {
    return v;
  }

  let n = Number(v);
  if(v.trim().length > 0 && !Number.isNaN(n)) {
    return n;
  }

  if( dt.fromISO(v).isValid ) {
    return new Date(v);
  }

  if (v.toLowerCase() === "true") {
    return true;
  }

  if (v.toLowerCase() === "false") {
    return false;
  }

  return v;
}



export {
  RadioButtonGroup,
  TextGroup,
  TextInput,
  TextAreaGroup,
  StatusIndicator,
  Label,
  ValidMsg,
  InvalidMsg,
  LoadingSpinner,
  Checkbox,
  StringToType
};
