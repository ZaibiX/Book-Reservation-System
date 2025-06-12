"use client";
import Link from "next/link";


export default function Home() {
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  const subtitleStyle = {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "40px",
  };

  const rolesContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginTop: "30px",
  };

  const roleCardStyle = {
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    padding: "30px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const roleCardHoverStyle = {
    ...roleCardStyle,
    borderColor: "#667eea",
    transform: "translateY(-5px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  };

  const buttonStyle = {
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    margin: "10px",
    transition: "background-color 0.3s ease",
  };
 
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>📚 University Library</h1>
        <p style={subtitleStyle}>Online Book Reservation System </p>
        <p style={{ color: "#888", marginBottom: "40px" }}>
          Welcome to our digital library platform. Choose your role to get
          started.
        </p>

        <div style={rolesContainerStyle}>
          <div style={roleCardStyle}>
            <h3
              style={{
                color: "#333",
                marginBottom: "15px",
                fontSize: "1.5rem",
              }}
            >
              👨‍🎓 Student Portal
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Browse books, make reservations, and manage your library account
            </p>
            <div>
              <Link href="/student/login" style={buttonStyle}>
                Student Login
              </Link>
              <Link
                href="/student/register"
                style={{ ...buttonStyle, backgroundColor: "#28a745" }}
              >
                Register Now
              </Link>
            </div>
          </div>

          <div style={roleCardStyle}>
            <h3
              style={{
                color: "#333",
                marginBottom: "15px",
                fontSize: "1.5rem",
              }}
            >
              👨‍💼 Librarian Portal
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Manage books, handle reservations, and oversee library operations
            </p>
            <div>
              <Link
                href="/librarian/login"
                style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
              >
                Librarian Login
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ color: "#333", marginBottom: "10px" }}>
            📋 Database Management System Project
          </h4>
          <p style={{ color: "#666", fontSize: "14px" }}>
            University Course Assignment - Online Book Reservation System
          </p>
        </div>
      </div>
    </div>
  );
}
