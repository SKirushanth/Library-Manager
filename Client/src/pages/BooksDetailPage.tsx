import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  copiesAvailable: number;
}

const fakeBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of wealth and love in the jazz age.",
    copiesAvailable: 3,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian novel about totalitarianism.",
    copiesAvailable: 2,
  },
  {
    id: 3,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A story about racial injustice in the American South.",
    copiesAvailable: 0,
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy adventure novel.",
    copiesAvailable: 5,
  },
  {
    id: 5,
    title: "Harry Potter",
    author: "J.K. Rowling",
    description: "A young wizard discovers his destiny.",
    copiesAvailable: 4,
  },
  {
    id: 6,
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A handbook of agile software craftsmanship.",
    copiesAvailable: 1,
  },
];

function BookDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Find the book matching the id from the URL
  const book = fakeBooks.find((b) => b.id === Number(id));

  // If no book found show a message
  if (!book) {
    return (
      <div style={{ padding: "40px" }}>
        <p>Book not found.</p>
        <button onClick={() => navigate("/books")}>Back to Books</button>
      </div>
    );
  }

  const handleRent = () => {
    if (!token) {
      setMessage("Please login to rent a book");
      return;
    }
    // Fake rent for now
    setMessage(
      "✅ Book rented successfully! A confirmation email will be sent.",
    );
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <button
        onClick={() => navigate("/books")}
        style={{
          marginBottom: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#555",
        }}
      >
        ← Back to Books
      </button>

      <h2>{book.title}</h2>
      <p style={{ color: "#555" }}>by {book.author}</p>
      <p style={{ margin: "15px 0", lineHeight: "1.6" }}>{book.description}</p>

      <p
        style={{
          color: book.copiesAvailable > 0 ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        {book.copiesAvailable > 0
          ? `${book.copiesAvailable} copies available`
          : "Currently not available"}
      </p>

      {message && (
        <p
          style={{
            color: message.includes("login") ? "red" : "green",
            margin: "15px 0",
          }}
        >
          {message}
        </p>
      )}

      <button
        onClick={handleRent}
        disabled={book.copiesAvailable === 0}
        style={{
          padding: "10px 25px",
          background: book.copiesAvailable === 0 ? "#ccc" : "#1a1a2e",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: book.copiesAvailable === 0 ? "not-allowed" : "pointer",
          fontSize: "16px",
        }}
      >
        {book.copiesAvailable === 0 ? "Not Available" : "Rent this Book"}
      </button>
    </div>
  );
}

export default BookDetailPage;
