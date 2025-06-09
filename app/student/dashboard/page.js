"use client";
import { useState, useEffect } from "react";
import styles from "../../../styles/stDashboard.module.css";

export default function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // Mock data setup omitted for brevity...


  useEffect(() => {
  // Mock book data
  const mockBooks = [
    {
      id: 1,
      name: "Clean Code",
      authors: ["Robert C. Martin"],
      isbn: "9780132350884",
      genre: "Programming",
      quantity: 3,
      reserved: false,
    },
    {
      id: 2,
      name: "Introduction to Algorithms",
      authors: ["Thomas H. Cormen", "Charles E. Leiserson"],
      isbn: "9780262033848",
      genre: "Computer Science",
      quantity: 1,
      reserved: false,
    },
    {
      id: 3,
      name: "JavaScript: The Good Parts",
      authors: ["Douglas Crockford"],
      isbn: "9780596517748",
      genre: "Programming",
      quantity: 0,
      reserved: false,
    },
    {
      id: 4,
      name: "Artificial Intelligence: A Modern Approach",
      authors: ["Stuart Russell", "Peter Norvig"],
      isbn: "9780136042594",
      genre: "Computer Science",
      quantity: 2,
      reserved: true,
    },
    {
      id: 5,
      name: "You Don’t Know JS",
      authors: ["Kyle Simpson"],
      isbn: "9781491904244",
      genre: "Programming",
      quantity: 5,
      reserved: false,
    },
  ];

  setBooks(mockBooks);
}, []);


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

  const handleReserveBook = (book) => {
    if (book.reserved || book.quantity === 0) {
      alert("This book is currently unavailable.");
      return;
    }
    alert(`Reservation request sent for "${book.name}"`);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "/";
    }
  };

  return (
    <div className={styles.containerStyle}>
      <header className={styles.headerStyle}>
        <div className={styles.headerContentStyle}>
          <div>
            <h1 style={{ margin: 0, color: "#333" }}>📚 Student Dashboard</h1>
            <p style={{ margin: "5px 0 0", color: "#666" }}>
              Welcome back, John Doe
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
