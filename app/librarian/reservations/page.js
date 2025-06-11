"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/librarian/login");
    }

    // Mock data
    setReservations([
      {
        id: 1,
        studentId: 1,
        studentName: "John Doe",
        studentEmail: "john@university.edu",
        bookId: 1,
        bookName: "Clean Code",
        isbn: "978-0132350884",
        createdAt: "2024-05-15",
        dueDate: "2024-05-29",
        status: "active",
        fine: 0,
      },
      {
        id: 2,
        studentId: 2,
        studentName: "Jane Smith",
        studentEmail: "jane@university.edu",
        bookId: 2,
        bookName: "Effective Java",
        isbn: "978-0134685991",
        createdAt: "2024-05-10",
        dueDate: "2024-05-24",
        status: "overdue",
        fine: 10,
      },
      {
        id: 3,
        studentId: 3,
        studentName: "Mike Johnson",
        studentEmail: "mike@university.edu",
        bookId: 3,
        bookName: "Design Patterns",
        isbn: "978-0201633610",
        createdAt: "2024-05-12",
        dueDate: "2024-05-26",
        status: "returned",
        fine: 0,
      },
      {
        id: 4,
        studentId: 4,
        studentName: "Sarah Wilson",
        studentEmail: "sarah@university.edu",
        bookId: 4,
        bookName: "Algorithms",
        isbn: "978-0321573513",
        createdAt: "2024-05-20",
        dueDate: null,
        status: "pending",
        fine: 0,
      },
    ]);
  }, [status, router]);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  };

  const headerStyle = {
    backgroundColor: "white",
    borderBottom: "1px solid #e0e0e0",
    padding: "20px 0",
  };

  const headerContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const mainContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    margin: "5px",
    width: "200px",
  };

  const buttonStyle = {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "2px",
    fontSize: "14px",
  };

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

  const handleApprove = (id) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status: "active",
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            }
          : reservation
      )
    );
    alert("Reservation approved!");
  };

  const handleReject = (id) => {
    setReservations((prev) =>
      prev.filter((reservation) => reservation.id !== id)
    );
    alert("Reservation rejected and removed!");
  };

  const handleReturn = (id) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "returned" }
          : reservation
      )
    );
    alert("Book returned successfully!");
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
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
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
              ...buttonStyle,
              backgroundColor: "#6c757d",
              textDecoration: "none",
            }}
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div style={mainContentStyle}>
        <div style={cardStyle}>
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
              style={{ ...inputStyle, width: "300px" }}
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={inputStyle}
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
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px", color: "#ffc107" }}>
                {reservations.filter((r) => r.status === "pending").length}
              </h3>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Pending
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px", color: "#28a745" }}>
                {reservations.filter((r) => r.status === "active").length}
              </h3>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Active
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px", color: "#dc3545" }}>
                {reservations.filter((r) => r.status === "overdue").length}
              </h3>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Overdue
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0 0 5px", color: "#6c757d" }}>
                {reservations.filter((r) => r.status === "returned").length}
              </h3>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                Returned
              </p>
            </div>
          </div>

          {/* Reservations Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Student
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Book
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    ISBN
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Reserved At
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Due Date
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Fine
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {reservation.studentName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {reservation.studentEmail}
                        </div>
                      </div>
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.bookName}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.isbn}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.createdAt}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.dueDate || "N/A"}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
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
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.fine > 0 ? `$${reservation.fine}` : "$0"}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {reservation.status === "pending" && (
                        <div>
                          <button
                            onClick={() => handleApprove(reservation.id)}
                            style={{
                              ...buttonStyle,
                              backgroundColor: "#28a745",
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(reservation.id)}
                            style={buttonStyle}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {(reservation.status === "active" ||
                        reservation.status === "overdue") && (
                        <button
                          onClick={() => handleReturn(reservation.id)}
                          style={{ ...buttonStyle, backgroundColor: "#17a2b8" }}
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
