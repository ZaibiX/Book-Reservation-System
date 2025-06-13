"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/stDashboard.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { data: session, status } = useSession();

  const router = useRouter();
  // Mock data setup omitted for brevity...

  useEffect(() => {
  if (status === "unauthenticated") {
    router.push("/student/login");
    return;
  }
  if (status === "authenticated") {
    axios.get("/api/get-books")
      .then(res => setBooks(res.data.books))
      .catch(err => {
        console.error("Failed to fetch books:", err);
        setBooks([]);
      });
    axios.get("/api/get-reservations")
      .then(res => setReservations(res.data.reservations))
      .catch(err => {
        console.error("Failed to fetch reservations:", err);
        setReservations([]);
      });
  }
}, [status, router]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleReserveBook = async (book) => {
  if (book.reserved || book.quantity === 0) {
    alert("This book is currently unavailable.");
    return;
  }
  try {
    const res = await axios.post("/api/set-reservations", { bookId: book.id });
    alert(res.data.message || `Reservation request sent for "${book.name}"`);
    // Re-fetch books and reservations to update UI
    axios.get("/api/get-books").then(res => setBooks(res.data.books));
    axios.get("/api/get-reservations").then(res => setReservations(res.data.reservations));
  } catch (err) {
    alert(err.response?.data?.error || "Failed to reserve book.");
    console.log(err.message);
  }
};

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      console.log(session);
      try {
        const signOutRes = await signOut();
        console.log("sign out heeee ");
        console.log(signOutRes);
        window.location.href = "/";
      } catch (err) {
        console.log("error while signing out: ", err.message);
      }
    }
  };
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  // Don't render dashboard if session is not ready
  if (!session) {
    return null; // Or a loading screen/spinner
  }
  if (session?.user.role !== "student") {
    router.push("/librarian/dashboard");
    return null;
  }
  return (
    <div className={styles.containerStyle}>
      <header className={styles.headerStyle}>
        <div className={styles.headerContentStyle}>
          <div>
            <h1 style={{ margin: 0, color: "#333" }}>📚 Student Dashboard</h1>
            <p style={{ margin: "5px 0 0", color: "#666" }}>
              Welcome back, John Doe {session.user.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={styles.buttonStyle}
            style={{ backgroundColor: "#dc3545" }}
          >
            Logout
          </button>
        </div>
      </header>

      <div className={styles.mainContentStyle}>
        <div>
          <div className={styles.cardStyle}>
            <h2 style={{ marginTop: 0, color: "#333" }}>📖 Browse Books</h2>

            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.inputStyle}
                style={{ marginBottom: 0, flex: 1 }}
              />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className={styles.inputStyle}
                style={{ marginBottom: 0, width: "auto" }}
              >
                <option value="All">All Genres</option>
                <option value="Programming">Programming</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div style={{ display: "grid", gap: "15px" }}>
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    padding: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 5px", color: "#333" }}>
                        {book.name}
                      </h3>
                      <p style={{ margin: "0 0 5px", color: "#666" }}>
                        by {book.authors.join(", ")}
                      </p>
                      <p
                        style={{
                          margin: "0 0 10px",
                          color: "#888",
                          fontSize: "14px",
                        }}
                      >
                        ISBN: {book.isbn}
                      </p>
                      <span
                        style={{
                          backgroundColor:
                            book.quantity > 0 ? "#28a745" : "#6c757d",
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          marginRight: "10px",
                        }}
                      >
                        {book.genre}
                      </span>
                      <span style={{ color: "#666", fontSize: "14px" }}>
                        Available: {book.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReserveBook(book)}
                      disabled={book.reserved || book.quantity === 0}
                      className={styles.buttonStyle}
                      style={{
                        backgroundColor:
                          book.reserved || book.quantity === 0
                            ? "#6c757d"
                            : "#667eea",
                      }}
                    >
                      {book.reserved ? "Reserved" : "Reserve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className={styles.cardStyle}>
            <h2 style={{ marginTop: 0, color: "#333" }}>📋 My Reservations</h2>
            {reservations.length > 0 ? (
              <div style={{ display: "grid", gap: "15px" }}>
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "6px",
                      padding: "15px",
                    }}
                  >
                    <h4 style={{ margin: "0 0 5px", color: "#333" }}>
                      {reservation.bookName}
                    </h4>
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      ISBN: {reservation.isbn}
                    </p>
                    <p
                      style={{
                        margin: "0 0 5px",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      Due: {reservation.dueDate}
                    </p>
                    <span
                      style={{
                        backgroundColor:
                          reservation.status === "active"
                            ? "#28a745"
                            : "#dc3545",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {reservation.status}
                    </span>
                    {reservation.fine > 0 && (
                      <p
                        style={{
                          margin: "10px 0 0",
                          color: "#dc3545",
                          fontSize: "14px",
                        }}
                      >
                        ⚠️ Fine: ${reservation.fine}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={{ color: "#666", textAlign: "center", padding: "20px" }}
              >
                No active reservations
              </p>
            )}
          </div>

          <div className={styles.cardStyle} style={{ marginTop: "20px" }}>
            <h3 style={{ marginTop: 0, color: "#333" }}>📊 Quick Stats</h3>
            <div style={{ display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Total Books</span>
                <span style={{ fontWeight: "bold" }}>{books.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>Available</span>
                <span style={{ fontWeight: "bold", color: "#28a745" }}>
                  {books.filter((b) => !b.reserved && b.quantity > 0).length}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666" }}>My Reservations</span>
                <span style={{ fontWeight: "bold", color: "#667eea" }}>
                  {reservations.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
