import React from "react";
import "./dotSpinner.css"; // Import custom CSS for animation

const DotSpinner = () => {
  return (
    <div className="dot-spinner">
      {[...Array(8)].map((_, i) => (
        <div className="dot-spinner__dot" key={i}></div>
      ))}
    </div>
  );
};

export default DotSpinner;
