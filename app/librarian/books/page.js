"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    isbn: "",
    name: "",
    authors: "",
    genre: "",
    quantity: 1,
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/librarian/login");
    }
    // Mock data
    // setBooks([
    //   {
    //     id: 1,
    //     isbn: "978-0134685991",
    //     name: "Effective Java",
    //     authors: ["Joshua Bloch"],
    //     genre: "Programming",
    //     quantity: 3,
    //     reserved: false,
    //   },
    //   {
    //     id: 2,
    //     isbn: "978-0596009205",
    //     name: "Head First Design Patterns",
    //     authors: ["Eric Freeman"],
    //     genre: "Programming",
    //     quantity: 2,
    //     reserved: false,
    //   },
    //   {
    //     id: 3,
    //     isbn: "978-0321573513",
    //     name: "Algorithms",
    //     authors: ["Robert Sedgewick"],
    //     genre: "Computer Science",
    //     quantity: 1,
    //     reserved: true,
    //   },
    //   {
    //     id: 4,
    //     isbn: "978-0262033848",
    //     name: "Introduction to Algorithms",
    //     authors: ["Thomas H. Cormen"],
    //     genre: "Computer Science",
    //     quantity: 4,
    //     reserved: false,
    //   },
    // ]);
    // Define the async function inside useEffect
    const fetchBooks = async () => {
      try {
        const resBooks = await axios.get("/api/books");
        console.log(resBooks);
        setBooks(resBooks.data);
        // return resBooks.data;
      } catch (err) {
        console.log("Error while fetching books: ", err.message);
      }
    };

    // Call the async function
    fetchBooks();
    // console.log("daataa is : ", data);
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
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    margin: "5px",
  };

  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
  };

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.authors.some((author) =>
        author.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      book.isbn.includes(searchTerm)
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBook) {
        // Update existing book
        const resPut = await axios.put("/api/books", {
          id: editingBook.id,
          ...formData,
        });
        // catch(err){console.log(err.message)}
        console.log(resPut);
      } else {
        // Add new book
        try {
          await axios.post("/api/books", formData);
        } catch (err) {
          console.log("Error while adding new book", err.message);
          return;
        }
      }

      // Refresh the books list
      const response = await axios.get("/api/books");
      setBooks(response.data);

      alert(
        editingBook ? "Book updated successfully!" : "Book added successfully!"
      );
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to " + (editingBook ? "update" : "add") + " book");
    }
  };

  const resetForm = () => {
    setFormData({
      isbn: "",
      name: "",
      authors: "",
      genre: "",
      quantity: 1,
    });
    setShowAddForm(false);
    setEditingBook(null);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      isbn: book.isbn,
      name: book.name,
      authors: book.authors, //book.authors.join(", ") if authors is an array
      genre: book.genre,
      quantity: book.quantity,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`/api/books?id=${id}`);

        // Refresh the books list
        const response = await axios.get("/api/books");
        setBooks(response.data);

        alert("Book deleted successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete book");
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
  if (session?.user.role !== "librarian") {
    router.push("/student/dashboard");
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={{ margin: 0, color: "#333" }}>📚 Book Management</h1>
            <p style={{ margin: "5px 0 0", color: "#666" }}>
              Add, edit, and manage library books
            </p>
          </div>
          <div>
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
            <button
              onClick={() => setShowAddForm(true)}
              style={{ ...buttonStyle, backgroundColor: "#28a745" }}
            >
              Add New Book
            </button>
          </div>
        </div>
      </header>

      <div style={mainContentStyle}>
        <div style={cardStyle}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...inputStyle, width: "300px" }}
            />
          </div>

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
                    ISBN
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Title
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Authors
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Genre
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    Quantity
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book, ind) => (
                  <tr key={ind}>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {book.isbn}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {book.name}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {book.authors /*book.authors.join(", ") if an array*/}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {book.genre}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      {book.quantity}
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      <span
                        style={{
                          backgroundColor: book.reserved
                            ? "#dc3545"
                            : "#28a745",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                        }}
                      >
                        {book.is_reserved ? "Reserved" : "Available"}
                      </span>
                    </td>
                    <td
                      style={{ padding: "12px", border: "1px solid #dee2e6" }}
                    >
                      <button
                        onClick={() => handleEdit(book)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: "#ffc107",
                          fontSize: "12px",
                          padding: "6px 12px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        style={{
                          ...buttonStyle,
                          fontSize: "12px",
                          padding: "6px 12px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Book Modal */}
      {showAddForm && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginTop: 0, color: "#333" }}>
              {editingBook ? "Edit Book" : "Add New Book"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, width: "100%", margin: 0 }}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  Book Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, width: "100%", margin: 0 }}
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  Authors (comma separated)
                </label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, width: "100%", margin: 0 }}
                  placeholder="Author 1, Author 2"
                  required
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, width: "100%", margin: 0 }}
                  required
                >
                  <option value="">Select Genre</option>
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    color: "#666",
                  }}
                >
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, width: "100%", margin: 0 }}
                  min="1"
                  required
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...buttonStyle, backgroundColor: "#28a745" }}
                >
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
