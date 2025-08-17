"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

//ahmad@email.com  ahmad123
export default function StudentLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
  if (status === "authenticated") {
    if (session?.user.role === "student") {
      router.push("/student/dashboard");
    } else if (session?.user.role === "librarian") {
      router.push("/librarian/dashboard");
    }
  }
}, [status, session, router]);

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    backgroundColor: "#667eea",
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
    
      // console.log('Student login:', formData)
      try{
        // const res= await axios.post("/api/login",formData);
        const signInRes=await signIn("credentials",{
          email:formData.email,
          password:formData.password,
          role:"student",
          // redirect:false,
          callbackUrl: "/student/dashboard",
        });
        console.log("Response from next- sign in: ",signInRes);
      }
      catch(err)
      {
        console.log("Response from next- sign in: ");
        // console.log(err)
        }
      

      setLoading(false);

      // router.push('/student/dashboard')
    
  };

  if (status === "loading") {
    return <p>Checking session...</p>;
    // return null;
  }



  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            👨‍🎓 Student Login
          </h2>
          <p style={{ color: "#666" }}>Access your library account</p>
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
          <p style={{ color: "#666", marginBottom: "15px" }}>
            Don't have an account?{" "}
            <Link
              href="/student/register"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              Register here
            </Link>
          </p>
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
