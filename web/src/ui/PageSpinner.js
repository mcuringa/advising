import React from "react";

const PageSpinner = (props)=> {

  if (!props.loading) {
    return null;
  }

  const spin = {
    width: "4rem",
    height: "4rem"
  }

  return (
    <div className="mt-5">
      <div className="">
        <div className="PageSpinner d-flex justify-content-center">
          <div className="spinner-grow spinner-grow-sm icon-gold" style={spin} role="status">
            <span className="sr-only">{props.msg}</span>
          </div>
        </div>
      </div>
      <div className="border-brown pt-2" style={{"borderTop":"4px solid #ffb500"}}>
        <h1 className="text-center text-brown">{props.msg}</h1>
      </div>
    </div>
  );
}

export default PageSpinner;
