import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Book {
  id: number;
  title: string;
  author: string;
  copiesAvailable: number;
}

const initialBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    copiesAvailable: 3,
  },
  { id: 2, title: "1984", author: "George Orwell", copiesAvailable: 2 },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    copiesAvailable: 0,
  },
  { id: 4, title: "The Hobbit", author: "J.R.R. Tolkien", copiesAvailable: 5 },
];

function AdminPage() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [token, role]);

  const handleAddBook = () => {
    if (title === "" || author === "" || copies === "") {
      alert("Please fill in all fields");
      return;
    }

    // Create new book and add to list
    const newBook: Book = {
      id: books.length + 1,
      title,
      author,
      copiesAvailable: Number(copies),
    };

    setBooks([...books, newBook]);

    // Clear inputs after adding
    setTitle("");
    setAuthor("");
    setCopies("");
  };

  const handleDelete = (id: number) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin Dashboard</h2>

      {/* Add book form */}
      <div
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Add New Book</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              flex: 1,
            }}
          />
          <input
            placeholder="Copies"
            type="number"
            value={copies}
            onChange={(e) => setCopies(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "80px",
            }}
          />
          <button
            onClick={handleAddBook}
            style={{
              padding: "8px 20px",
              background: "#1a1a2e",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Book
          </button>
        </div>
      </div>

      {/* Books list */}
      <h3>All Books ({books.length})</h3>
      {books.map((book) => (
        <div
          key={book.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            border: "1px solid #ddd",
            padding: "15px 20px",
            marginBottom: "10px",
            borderRadius: "8px",
          }}
        >
          <div>
            <strong>{book.title}</strong>
            <span style={{ color: "#555" }}> by {book.author}</span>
            <span
              style={{
                marginLeft: "15px",
                color: book.copiesAvailable > 0 ? "green" : "red",
              }}
            >
              {book.copiesAvailable} copies
            </span>
          </div>
          <button
            onClick={() => handleDelete(book.id)}
            style={{
              padding: "6px 15px",
              background: "none",
              border: "1px solid red",
              color: "red",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPage;
