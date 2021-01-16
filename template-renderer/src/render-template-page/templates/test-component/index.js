import React from "react";

function TestComponent({ customText }) {
  return (
    <div className="g-test-component">
      <p>Hello world!</p>
      <p className="child-class">{customText}</p>
    </div>
  );
}

export default TestComponent;
