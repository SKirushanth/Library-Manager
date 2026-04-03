import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Silk from "../components/Silk";

interface Book {
  id: number;
  title: string;
  author: string;
  copiesAvailable: number;
  imageUrl?: string;
}

function AdminPage() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CLOUD_NAME = "df8aj6mzn";
  const UPLOAD_PRESET = "library_preset";

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/login");
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setBooks(response.data ?? []);
      } catch {
        setError("Failed to load books from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token, role, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );
      const data = await response.json();
      setImageUrl(data.secure_url ?? "");
    } catch {
      setError("Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBook = async () => {
    if (!title || !author || !copies) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await api.post("/books", {
        title,
        author,
        description: "",
        copiesAvailable: Number(copies),
        imageUrl,
        pages: 0,
        rating: 0,
        badge: null,
        coverColor: "#5d4037",
        spineColor: "#3e2723",
      });
      setBooks((prev) => [...prev, response.data]);
      setTitle("");
      setAuthor("");
      setCopies("");
      setImageUrl("");
    } catch {
      setError("Failed to add book. Please check admin access.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        setBooks((prev) => prev.filter((book) => book.id !== id));
      } catch {
        setError("Failed to delete book.");
      }
    }
  };

  return (
    <div className="audible-exclusives admin-page-shell">
      <div className="admin-silk-layer">
        <Silk
          color="#22201f"
          speed={1.8}
          scale={1.2}
          noiseIntensity={1.4}
          rotation={0.08}
        />
      </div>

      <div className="admin-grain-overlay" />

      <div className="admin-page-wrap">
        <div className="audible-exclusives-header admin-header">
          <p className="audible-exclusives-kicker">Management Dashboard</p>
          <h2>Library Archive</h2>
          <p className="audible-exclusives-subheadline">
            Catalog and manage the digital collection of exclusive literary
            assets.
          </p>
        </div>

        {error && (
          <p className="auth-feedback is-error admin-feedback">{error}</p>
        )}

        <section
          className="auth-modal admin-form-card"
          aria-label="Add new book form"
        >
          <h3 className="exclusive-title admin-section-title">
            Add New Volume
          </h3>

          <div className="auth-panel admin-form-grid">
            <div className="admin-field admin-field-full">
              <label>Book Title</label>
              <input
                placeholder="Enter title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label>Author Name</label>
              <input
                placeholder="Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="admin-field admin-copies-field">
              <label>Copies</label>
              <input
                type="number"
                placeholder="1"
                value={copies}
                onChange={(e) => setCopies(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label>Cover Asset</label>
              <label className="admin-upload-trigger">
                <span className="admin-upload-box">
                  {isUploading
                    ? "Uploading..."
                    : imageUrl
                      ? "Cover Ready"
                      : "Select Image File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            <button
              className="auth-submit admin-submit"
              onClick={handleAddBook}
              disabled={isUploading}
            >
              {isUploading ? "Processing..." : "Register Volume"}
            </button>
          </div>
        </section>

        <section className="admin-list-area" aria-label="Managed inventory">
          <h3 className="exclusive-title admin-list-title">
            Current Inventory ({books.length})
          </h3>

          {loading ? (
            <p className="admin-loading">Synchronizing archive...</p>
          ) : (
            <div className="admin-books-list">
              {books.map((book) => (
                <article key={book.id} className="auth-modal admin-book-row">
                  <div className="admin-book-main">
                    <div className="spotlight-cover-art admin-mini-cover">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt="cover"
                          className="admin-cover-image"
                        />
                      ) : (
                        <div className="admin-no-cover">N/A</div>
                      )}
                      <div className="exclusive-cover-sheen"></div>
                    </div>

                    <div className="admin-book-meta">
                      <p className="exclusive-title admin-book-title">
                        {book.title}
                      </p>
                      <p className="exclusive-author">{book.author}</p>
                      <p className="admin-book-count">
                        {book.copiesAvailable} copies in archive
                      </p>
                    </div>
                  </div>

                  <button
                    className="auth-toggle admin-remove-btn"
                    onClick={() => handleDelete(book.id)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminPage;
