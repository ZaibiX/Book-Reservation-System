import React from "react";

const ringStyle = {
  boxSizing: "border-box",
  display: "inline-block",
  position: "relative",
  width: "40px",   // smaller size for button spinner
  height: "40px",
};

const ringDivStyleBase = {
  boxSizing: "border-box",
  display: "block",
  position: "absolute",
  width: "32px",
  height: "32px",
  margin: "4px",
  border: "4px solid currentColor",
  borderRadius: "50%",
  borderColor: "currentColor transparent transparent transparent",
  animationTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)",
  animationName: "ldsRing",
  animationDuration: "1.2s",
  animationIterationCount: "infinite",
};

const animationDelays = ["-0.45s", "-0.3s", "-0.15s", "0s"];

export default function LoadingSpinner() {
  return (
    <>
      <style>
        {`
          @keyframes ldsRing {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div style={ringStyle} aria-label="Loading spinner" role="img">
        {animationDelays.map((delay, i) => (
          <div
            key={i}
            style={{
              ...ringDivStyleBase,
              animationDelay: delay,
              top: 0,
              left: 0,
            }}
          />
        ))}
      </div>
    </>
  );
}
