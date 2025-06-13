"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  // Async function to fetch reservations
  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/reservations");
      setReservations(res.data.reservations);
    } catch (err) {
      setReservations([]);
      alert("Failed to fetch reservations.");
      console.log(err)
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/librarian/login");
      return;
    }
    if (status === "authenticated") {
      fetchReservations();
    }
  }, [status, router]);

  const handleApprove = async (id) => {
    try {
      await axios.post("/api/reservations", { reservationId: id, action: "approve" });
      await fetchReservations();
      alert("Reservation approved!");
    } catch (err) {
      alert("Failed to approve reservation.");
      console.log(err)
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post("/api/reservations", { reservationId: id, action: "reject" });
      await fetchReservations();
      alert("Reservation rejected and removed!");
    } catch (err) {
      alert("Failed to reject reservation.");
      console.log(err)
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.post("/api/reservations", { reservationId: id, action: "return" });
      await fetchReservations();
      alert("Book returned successfully!");
    } catch (err) {
      alert("Failed to mark as returned.");
      console.log(err)
    }
  };

  const calculateFine = (dueDate, status) => {
    if (status !== "overdue" || !dueDate) return 0;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.ceil(diffDays / 7);
    return weeks > 0 ? weeks * 10 : 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "active":
        return "#28a745";
      case "overdue":
        return "#dc3545";
      case "returned":
        return "#6c757d";
      default:
        return "#17a2b8";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Approval";
      case "active":
        return "Active";
      case "overdue":
        return "Overdue";
      case "returned":
        return "Returned";
      default:
        return status;
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  // Don't render dashboard if session is not ready
  if (!session) {
    return null; // Or a loading screen/spinner
  }
  if (session?.user.role !== "librarian") {
    router.push("/student/dashboard");
    return null;
  }

  const filteredReservations = reservations.filter((reservation) => {
    const matchesFilter = filter === "all" || reservation.status === filter;
    const matchesSearch =
      reservation.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.isbn.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // ... UI code remains the same as before

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
    }}>
      <header style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: "20px 0",
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <h1 style={{ margin: 0, color: "#333" }}>
              📋 Reservation Management
            </h1>
            <p style={{ margin: "5px 0 0", color: "#666" }}>
              Manage student book reservations
            </p>
          </div>
          <Link
            href="/librarian/dashboard"
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              margin: "2px",
              fontSize: "14px",
              textDecoration: "none",
            }}
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}>
          {/* Filters and Search */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="Search by student, book, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                margin: "5px",
                width: "300px",
              }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                margin: "5px",
                width: "200px",
              }}
            >
              <option value="all">All Reservations</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* Summary Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "15px",
              marginBottom: "30px",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderRadius: "6px",
            }}
          >
            {["pending", "active", "overdue", "returned"].map((statusKey) => (
              <div style={{ textAlign: "center" }} key={statusKey}>
                <h3 style={{
                  margin: "0 0 5px",
                  color: getStatusColor(statusKey),
                }}>
                  {reservations.filter((r) => r.status === statusKey).length}
                </h3>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                  {getStatusText(statusKey)}
                </p>
              </div>
            ))}
          </div>

          {/* Reservations Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={thStyle}>Student</th>
                  <th style={thStyle}>Book</th>
                  <th style={thStyle}>ISBN</th>
                  <th style={thStyle}>Reserved At</th>
                  <th style={thStyle}>Due Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Fine</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td style={tdStyle}>
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {reservation.studentName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {reservation.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      {reservation.bookName}
                    </td>
                    <td style={tdStyle}>
                      {reservation.isbn}
                    </td>
                    <td style={tdStyle}>
                      {reservation.createdAt}
                    </td>
                    <td style={tdStyle}>
                      {reservation.dueDate || "N/A"}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          backgroundColor: getStatusColor(reservation.status),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {/* If your API provides a fine field, use it.
                          Otherwise, you can uncomment the next line to calculate it on the fly:
                          {calculateFine(reservation.dueDate, reservation.status) > 0 ? `$${calculateFine(reservation.dueDate, reservation.status)}` : "$0"} */}
                      {reservation.fine !== undefined
                        ? (reservation.fine > 0 ? `$${reservation.fine}` : "$0")
                        : "$0"}
                    </td>
                    <td style={tdStyle}>
                      {reservation.status === "pending" && (
                        <div>
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            style={{
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              margin: "2px",
                              fontSize: "14px",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(reservation.id)}
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              margin: "2px",
                              fontSize: "14px",
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {(reservation.status === "active" ||
                        reservation.status === "overdue") && (
                        <button
                          onClick={() => handleReturn(reservation.id)}
                          style={{
                            backgroundColor: "#17a2b8",
                            color: "white",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            margin: "2px",
                            fontSize: "14px",
                          }}
                        >
                          Mark Returned
                        </button>
                      )}
                      {reservation.status === "returned" && (
                        <span style={{ color: "#666", fontSize: "12px" }}>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length === 0 && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
              No reservations found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Table cell and header styles
const thStyle = {
  padding: "12px",
  textAlign: "left",
  border: "1px solid #dee2e6",
};
const tdStyle = {
  padding: "12px",
  border: "1px solid #dee2e6",
};