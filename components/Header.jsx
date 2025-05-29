import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 20px",
        backgroundColor: "#0070f3",
        color: "white",
        fontWeight: "bold",
        fontSize: "1.25rem",
        flexWrap: "wrap",
        height:80
      }}
    >
      <div style={{ flex: "1 1 auto" }}>Online Book Reservation</div>
      {user && (
        <button
          onClick={onLogout}
          style={{
            backgroundColor: "transparent",
            border: "1px solid white",
            borderRadius: "4px",
            color: "white",
            padding: "6px 14px",
            cursor: "pointer",
            flexShrink: 0,
            marginTop: "8px",
          }}
        >
          Logout
        </button>
      )}
    </header>
  );
}
