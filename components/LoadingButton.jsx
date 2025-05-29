import React from "react";

export default function LoadingButton({ isLoading, children, ...props }) {
  const spinnerStyle = {
    marginRight: "5px",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <button
        {...props}
        disabled={isLoading || props.disabled}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: isLoading ? "#999" : "#0070f3",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: "4px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.7 : 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {isLoading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={spinnerStyle}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              style={{ opacity: 0.25 }}
            />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
              style={{ opacity: 0.75 }}
            />
          </svg>
        
        )}
        {children}
      </button>
    </>
  );
}
