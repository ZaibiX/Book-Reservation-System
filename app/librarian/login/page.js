"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

//john@email.com  admin123
export default function LibrarianLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user.role === "librarian") {
        router.push("/librarian/dashboard");
      }
    }
  }, [status, router]);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "2px solid #e0e0e0",
    borderRadius: "6px",
    fontSize: "16px",
    marginBottom: "20px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "20px",
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    
      console.log("Librarian login:", formData);
      try {
        // const res= await axios.post("/api/login",formData);
        signIn("credentials", {
          email: formData.email,
          password: formData.password,
          role: "librarian",
          // redirect:false,
          callbackUrl: "/librarian/dashboard",
        });
        // console.log(res);
      } catch (err) {
        // console.log(err)
        if (err.response) {
          alert(err.response.data.message);
        } else {
          console.error("Error: ", err.message);
        }
      }

      setLoading(false);
     
  };

  if (status === "loading") {
    return <p>Checking session...</p>;
    // return null;
  }

  if (session?.user.role === "librarian") {
    router.push("/librarian/dashboard");
    return null;
  }

  if (session?.user.role === "student") {
    router.push("/student/dashboard");
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            👨‍💼 Librarian Login
          </h2>
          <p style={{ color: "#666" }}>Access admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/"
            style={{ color: "#888", textDecoration: "none", fontSize: "14px" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
