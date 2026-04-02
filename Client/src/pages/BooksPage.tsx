import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the shape of a Book
interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  copiesAvailable: number;
}

// Fake book data for now
const fakeBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A story of wealth and love.",
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
    description: "A story about racial injustice.",
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

function BooksPage() {
  const [books] = useState<Book[]>(fakeBooks);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Filter books based on search — checks both title and author
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ padding: "30px" }}>
      <h2>📚 All Books</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by title or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "25px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      {/* Book grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "8px" }}>{book.title}</h3>
            <p style={{ color: "#555" }}>by {book.author}</p>
            <p style={{ fontSize: "14px", color: "#777" }}>
              {book.description}
            </p>
            <p style={{ color: book.copiesAvailable > 0 ? "green" : "red" }}>
              {book.copiesAvailable > 0
                ? `${book.copiesAvailable} copies available`
                : "Not available"}
            </p>
            <button
              onClick={() => navigate(`/books/${book.id}`)}
              style={{
                marginTop: "10px",
                padding: "8px 15px",
                background: "#1a1a2e",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Show message if no books found */}
      {filteredBooks.length === 0 && (
        <p style={{ color: "#888", marginTop: "20px" }}>
          No books found matching your search.
        </p>
      )}
    </div>
  );
}

export default BooksPage;
