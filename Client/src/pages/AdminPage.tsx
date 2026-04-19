import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Silk from "../components/Silk";
import type { Book, Rental } from "../types";

// ── BRAND CONSTANTS ──
const COPPER_GRADIENT =
  "linear-gradient(100deg, #8f5637 0%, #c4865f 48%, #9b613f 100%)";
const SILVER_TEXT = "#c0c0c0";
const normalizeStatus = (status: string) =>
  status === "ACTIVE" ? "PICKED_UP" : status;
const ACTIVE_RENTAL_STATUSES = new Set(["RESERVED", "PICKED_UP", "OVERDUE"]);

// ── GRADIENT TEXT COMPONENT ──
function GradientText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <span style={{ color: SILVER_TEXT, ...style }}>{children}</span>;
}

export default function AdminPage() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  // Layout State
  const [activeTab, setActiveTab] = useState<"overview" | "books" | "rentals">(
    "overview",
  );
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Data State
  const [books, setBooks] = useState<Book[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [copies, setCopies] = useState("");
  const [rating, setRating] = useState("");
  const [pages, setPages] = useState("");
  const [badge, setBadge] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const CLOUD_NAME = "df8aj6mzn";
  const UPLOAD_PRESET = "library_preset";

  // ── EFFECTS & FETCHING ──
  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/login");
      return;
    }
    fetchBooks();
    fetchRentals();
  }, [token, role, navigate]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books");
      setBooks(response.data ?? []);
    } catch {
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await api.get("/rentals");
      setRentals(
        (response.data ?? []).map((r: Rental) => ({
          ...r,
          status: normalizeStatus(r.status),
        })),
      );
    } catch {
      setError("Failed to load rentals.");
    } finally {
      setRentalsLoading(false);
    }
  };

  const formatDate = (value: string | null) => {
    if (!value) return "--";
    if (!value.includes("T")) return value;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ── HANDLERS ──
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      alert("Please fill in all required fields (Title, Author, Copies)");
      return;
    }
    try {
      const coverColor = badge ? "#1a1a2e" : "#5d4037";
      const spineColor = badge ? "#0f0f1a" : "#3e2723";

      const response = await api.post("/books", {
        title,
        author,
        description: "",
        copiesAvailable: Number(copies),
        imageUrl,
        pages: Number(pages) || 0,
        rating: Number(rating) || 0,
        badge: badge === "" ? null : badge,
        coverColor,
        spineColor,
      });
      setBooks((prev) => [...prev, response.data]);

      setTitle("");
      setAuthor("");
      setCopies("");
      setRating("");
      setPages("");
      setBadge("");
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

  const handleConfirmPickup = async (rentalId: number) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/pickup`, {});
      const updatedRental = {
        ...(response.data as Rental),
        status: normalizeStatus((response.data as Rental).status),
      };

      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, ...updatedRental } : r)),
      );
    } catch {
      setError("Failed to confirm pickup.");
    }
  };

  const handleReturn = async (rentalId: number) => {
    try {
      const response = await api.put(`/rentals/${rentalId}/return`, {});
      const updatedRental = {
        ...(response.data as Rental),
        status: normalizeStatus((response.data as Rental).status),
      };
      const returned = rentals.find((r) => r.id === rentalId);

      setRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, ...updatedRental } : r)),
      );

      if (returned && normalizeStatus(returned.status) !== "RETURNED") {
        setBooks((prev) =>
          prev.map((b) =>
            b.title === returned.bookTitle
              ? { ...b, copiesAvailable: b.copiesAvailable + 1 }
              : b,
          ),
        );
      }
    } catch {
      setError("Failed to mark as returned.");
    }
  };

  const reservedRentals = rentals.filter(
    (r) => normalizeStatus(r.status) === "RESERVED",
  );
  const inCirculationRentals = rentals.filter((r) => {
    const status = normalizeStatus(r.status);
    return status === "PICKED_UP" || status === "OVERDUE";
  });
  const activeRentals = rentals.filter((r) =>
    ACTIVE_RENTAL_STATUSES.has(normalizeStatus(r.status)),
  );
  const returnedRentals = rentals.filter(
    (r) => normalizeStatus(r.status) === "RETURNED",
  );
  const totalRentals = rentals.length;

  const adminTabs = [
    { id: "overview", label: "Dashboard Overview" },
    { id: "books", label: "Manage Books" },
    { id: "rentals", label: "Manage Rentals" },
  ];

  return (
    <>
      <style>{`
        .no-spin::-webkit-inner-spin-button,
        .no-spin::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spin {
          -moz-appearance: textfield;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          height: "100vh",
          backgroundColor: "#0a0908",
          color: SILVER_TEXT,
          fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.5 }}
        >
          <Silk
            color="#22201f"
            speed={1.8}
            scale={1.2}
            noiseIntensity={1.4}
            rotation={0.08}
          />
        </div>
        <div
          className="admin-grain-overlay"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background: "url('https://grainy-gradients.vercel.app/noise.svg')",
            opacity: 0.15,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            height: "100vh",
          }}
        >
          <aside
            style={{
              width: "280px",
              height: "100%",
              boxSizing: "border-box",
              backgroundColor: "rgba(20, 18, 16, 0.7)",
              borderRight: "1px solid rgba(182, 129, 92, 0.15)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "48px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill={SILVER_TEXT}
              >
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
              </svg>
              <GradientText
                style={{
                  fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                  fontSize: "18px",
                  fontWeight: "700",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                The Reader's Nook
              </GradientText>
            </div>

            <nav
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(192,192,192,0.4)",
                  marginBottom: "12px",
                  fontWeight: 700,
                }}
              >
                Management Menu
              </div>
              {adminTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isHovered = hoveredTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    onMouseEnter={() => setHoveredTab(tab.id)}
                    onMouseLeave={() => setHoveredTab(null)}
                    style={{
                      background: isActive
                        ? "rgba(182, 129, 92, 0.1)"
                        : "transparent",
                      border: "none",
                      borderLeft: isActive
                        ? "3px solid #c4865f"
                        : "3px solid transparent",
                      padding: "12px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      color: isActive || isHovered ? "#e6e6e6" : SILVER_TEXT,
                      fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.2s ease",
                      borderRadius: "0 4px 4px 0",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                background: COPPER_GRADIENT,
                color: SILVER_TEXT,
                fontWeight: 700,
                transition: "opacity 0.2s ease",
                marginTop: "auto",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Logout
            </button>
          </aside>

          <main
            style={{
              flex: 1,
              height: "100%",
              boxSizing: "border-box",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "48px 64px", minHeight: "100%" }}>
              {error && (
                <div
                  style={{
                    background: "rgba(220, 53, 69, 0.1)",
                    border: "1px solid rgba(220, 53, 69, 0.3)",
                    color: "#ff8da1",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "32px",
                    fontSize: "14px",
                  }}
                >
                  {error}
                </div>
              )}

              {activeTab === "overview" && (
                <div>
                  <h1
                    style={{
                      fontSize: "28px",
                      color: "#e6e6e6",
                      fontWeight: 600,
                      marginBottom: "32px",
                    }}
                  >
                    Dashboard Overview
                  </h1>
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      marginBottom: "48px",
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(182, 129, 92, 0.2)",
                        borderRadius: "8px",
                        padding: "24px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "rgba(192,192,192,0.6)",
                          marginBottom: "8px",
                        }}
                      >
                        Total Volumes
                      </div>
                      <div
                        style={{
                          fontSize: "32px",
                          color: "#e6e6e6",
                          fontWeight: 600,
                        }}
                      >
                        {loading ? "..." : books.length}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(182, 129, 92, 0.2)",
                        borderRadius: "8px",
                        padding: "24px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "rgba(192,192,192,0.6)",
                          marginBottom: "8px",
                        }}
                      >
                        Active Rentals
                      </div>
                      <div
                        style={{
                          fontSize: "32px",
                          color: "#e6e6e6",
                          fontWeight: 600,
                        }}
                      >
                        {rentalsLoading ? "..." : activeRentals.length}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(182, 129, 92, 0.2)",
                        borderRadius: "8px",
                        padding: "24px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "rgba(192,192,192,0.6)",
                          marginBottom: "8px",
                        }}
                      >
                        Total Rentals
                      </div>
                      <div
                        style={{
                          fontSize: "32px",
                          color: "#e6e6e6",
                          fontWeight: 600,
                        }}
                      >
                        {rentalsLoading ? "..." : totalRentals}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "books" && (
                <div>
                  <h1
                    style={{
                      fontSize: "28px",
                      color: "#e6e6e6",
                      fontWeight: 600,
                      marginBottom: "32px",
                    }}
                  >
                    Manage Books
                  </h1>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(182, 129, 92, 0.2)",
                      borderRadius: "12px",
                      padding: "32px",
                      marginBottom: "48px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#c4865f",
                        fontSize: "16px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "24px",
                      }}
                    >
                      Add New Volume
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                      }}
                    >
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Book Title
                        </label>
                        <input
                          placeholder="Enter title..."
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Author Name
                        </label>
                        <input
                          placeholder="Name"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Copies Available
                        </label>
                        <input
                          type="number"
                          className="no-spin"
                          placeholder="e.g. 5"
                          value={copies}
                          onChange={(e) => setCopies(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Rating
                        </label>
                        <input
                          type="number"
                          className="no-spin"
                          step="0.1"
                          min="0"
                          max="5"
                          placeholder="0.0 - 5.0"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Total Pages
                        </label>
                        <input
                          type="number"
                          className="no-spin"
                          placeholder="e.g. 350"
                          value={pages}
                          onChange={(e) => setPages(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: "1 / -1" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Book Badge Status
                        </label>
                        <select
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px solid rgba(182, 129, 92, 0.3)",
                            borderRadius: "6px",
                            padding: "12px 16px",
                            color: "#fff",
                            outline: "none",
                            boxSizing: "border-box",
                            cursor: "pointer",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c0c0c0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 16px center",
                            backgroundSize: "16px",
                          }}
                        >
                          <option style={{ background: "#222" }} value="">
                            No Badge / Standard
                          </option>
                          <option
                            style={{ background: "#222" }}
                            value="PREMIUM"
                          >
                            Premium
                          </option>
                          <option
                            style={{ background: "#222" }}
                            value="EXCLUSIVE"
                          >
                            Exclusive
                          </option>
                        </select>
                      </div>

                      <div style={{ gridColumn: "1 / -1" }}>
                        <label
                          style={{
                            display: "block",
                            fontSize: "12px",
                            color: "rgba(192,192,192,0.8)",
                            marginBottom: "8px",
                            textTransform: "uppercase",
                          }}
                        >
                          Cover Asset
                        </label>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyItems: "center",
                            justifyContent: "center",
                            background: "rgba(0,0,0,0.4)",
                            border: "1px dashed rgba(182, 129, 92, 0.5)",
                            borderRadius: "6px",
                            padding: "16px",
                            cursor: "pointer",
                            color: "rgba(192,192,192,0.6)",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "#c4865f")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor =
                              "rgba(182, 129, 92, 0.5)")
                          }
                        >
                          <span>
                            {isUploading
                              ? "Uploading..."
                              : imageUrl
                                ? "✅ Cover Ready"
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

                      <div style={{ gridColumn: "1 / -1", marginTop: "8px" }}>
                        <button
                          onClick={handleAddBook}
                          disabled={isUploading}
                          style={{
                            background: COPPER_GRADIENT,
                            color: SILVER_TEXT,
                            padding: "14px",
                            width: "100%",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            cursor: isUploading ? "not-allowed" : "pointer",
                            opacity: isUploading ? 0.7 : 1,
                          }}
                        >
                          {isUploading ? "Processing..." : "Register Volume"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3
                    style={{
                      color: "#e6e6e6",
                      fontSize: "18px",
                      marginBottom: "24px",
                    }}
                  >
                    Current Inventory ({books.length})
                  </h3>
                  {loading ? (
                    <p style={{ color: "rgba(192,192,192,0.5)" }}>
                      Synchronizing archive...
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        paddingBottom: "40px",
                      }}
                    >
                      {books.map((book) => (
                        <div
                          key={book.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(182, 129, 92, 0.15)",
                            borderRadius: "8px",
                            padding: "16px 24px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "24px",
                            }}
                          >
                            {book.imageUrl ? (
                              <img
                                src={book.imageUrl}
                                alt="cover"
                                style={{
                                  width: "48px",
                                  height: "72px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: "48px",
                                  height: "72px",
                                  background: "#222",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "10px",
                                  color: "#666",
                                }}
                              >
                                N/A
                              </div>
                            )}
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  margin: "0 0 4px 0",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#e6e6e6",
                                    margin: 0,
                                  }}
                                >
                                  {book.title}
                                </p>
                                {book.badge && (
                                  <span
                                    style={{
                                      background:
                                        book.badge === "PREMIUM"
                                          ? "rgba(196, 134, 95, 0.2)"
                                          : "rgba(138, 105, 212, 0.2)",
                                      color:
                                        book.badge === "PREMIUM"
                                          ? "#c4865f"
                                          : "#bca6e8",
                                      padding: "2px 6px",
                                      borderRadius: "4px",
                                      fontSize: "9px",
                                      fontWeight: 700,
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    {book.badge}
                                  </span>
                                )}
                              </div>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "rgba(192,192,192,0.7)",
                                  margin: "0 0 8px 0",
                                }}
                              >
                                {book.author}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "12px",
                                  alignItems: "center",
                                }}
                              >
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "#c4865f",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                    margin: 0,
                                  }}
                                >
                                  {book.copiesAvailable} copies available
                                </p>
                                <span
                                  style={{ opacity: 0.3, fontSize: "10px" }}
                                >
                                  |
                                </span>
                                <p
                                  style={{
                                    fontSize: "11px",
                                    color: "rgba(192,192,192,0.6)",
                                    margin: 0,
                                  }}
                                >
                                  ⭐{" "}
                                  {book.rating > 0
                                    ? book.rating.toFixed(1)
                                    : "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(book.id)}
                            style={{
                              background: "transparent",
                              border: "1px solid rgba(220, 53, 69, 0.5)",
                              color: "#ff8da1",
                              padding: "8px 16px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(220, 53, 69, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "rentals" && (
                <div>
                  <h1
                    style={{
                      fontSize: "28px",
                      color: "#e6e6e6",
                      fontWeight: 600,
                      marginBottom: "32px",
                    }}
                  >
                    Manage Rentals
                  </h1>

                  <h3
                    style={{
                      color: "#c4865f",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "24px",
                    }}
                  >
                    Awaiting Pickup ({reservedRentals.length})
                  </h3>

                  {rentalsLoading ? (
                    <p
                      style={{
                        color: "rgba(192,192,192,0.5)",
                        marginBottom: "48px",
                      }}
                    >
                      Loading rentals...
                    </p>
                  ) : reservedRentals.length === 0 ? (
                    <p
                      style={{
                        color: "rgba(192,192,192,0.5)",
                        marginBottom: "48px",
                      }}
                    >
                      No reservations awaiting pickup.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        marginBottom: "48px",
                      }}
                    >
                      {reservedRentals.map((rental) => (
                        <div
                          key={rental.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            flexWrap: "wrap",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(182, 129, 92, 0.2)",
                            borderRadius: "8px",
                            padding: "16px 24px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "24px",
                            }}
                          >
                            {(() => {
                              const matchedBook = books.find(
                                (b) => b.title === rental.bookTitle,
                              );
                              return matchedBook?.imageUrl ? (
                                <img
                                  src={matchedBook.imageUrl}
                                  alt="cover"
                                  style={{
                                    width: "44px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "2px 8px 8px 2px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "44px",
                                    height: "60px",
                                    background: rental.coverColor || "#C68642",
                                    borderRadius: "2px 8px 8px 2px",
                                    position: "relative",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: "6px",
                                      background: "rgba(0,0,0,0.25)",
                                      borderRadius: "2px 0 0 2px",
                                    }}
                                  />
                                </div>
                              );
                            })()}

                            <div>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#e6e6e6",
                                  margin: "0 0 4px 0",
                                }}
                              >
                                {rental.bookTitle}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "rgba(192,192,192,0.7)",
                                  margin: "0 0 8px 0",
                                }}
                              >
                                by {rental.bookAuthor}{" "}
                                <span style={{ opacity: 0.3, margin: "0 6px" }}>
                                  |
                                </span>{" "}
                                <span style={{ color: "#eed4a0" }}>
                                  👤 {rental.username || "User"}
                                </span>
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "16px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{ fontSize: "11px", color: "#f2c080" }}
                                >
                                  Code: {rental.collectionCode}
                                </span>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "rgba(192,192,192,0.55)",
                                  }}
                                >
                                  Reserved: {formatDate(rental.rentalDate)}
                                </span>
                                <span
                                  style={{ fontSize: "11px", color: "#c4865f" }}
                                >
                                  Pickup by:{" "}
                                  {formatDateTime(rental.pickupDeadline)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleConfirmPickup(rental.id)}
                            style={{
                              background: "rgba(122,184,122,0.1)",
                              border: "1px solid rgba(122,184,122,0.45)",
                              color: "#7ab87a",
                              padding: "8px 20px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(122,184,122,0.18)";
                              e.currentTarget.style.borderColor = "#7ab87a";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(122,184,122,0.1)";
                              e.currentTarget.style.borderColor =
                                "rgba(122,184,122,0.45)";
                            }}
                          >
                            Confirm Pickup
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <h3
                    style={{
                      color: "#c4865f",
                      fontSize: "16px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "24px",
                    }}
                  >
                    Picked Up and Overdue ({inCirculationRentals.length})
                  </h3>

                  {rentalsLoading ? null : inCirculationRentals.length === 0 ? (
                    <p
                      style={{
                        color: "rgba(192,192,192,0.5)",
                        marginBottom: "48px",
                      }}
                    >
                      No picked-up rentals in circulation.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        marginBottom: "48px",
                      }}
                    >
                      {inCirculationRentals.map((rental) => (
                        <div
                          key={rental.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            flexWrap: "wrap",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(182, 129, 92, 0.15)",
                            borderRadius: "8px",
                            padding: "16px 24px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "24px",
                            }}
                          >
                            {(() => {
                              const matchedBook = books.find(
                                (b) => b.title === rental.bookTitle,
                              );
                              return matchedBook?.imageUrl ? (
                                <img
                                  src={matchedBook.imageUrl}
                                  alt="cover"
                                  style={{
                                    width: "44px",
                                    height: "60px",
                                    objectFit: "cover",
                                    borderRadius: "2px 8px 8px 2px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "44px",
                                    height: "60px",
                                    background: rental.coverColor || "#C68642",
                                    borderRadius: "2px 8px 8px 2px",
                                    position: "relative",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "absolute",
                                      left: 0,
                                      top: 0,
                                      bottom: 0,
                                      width: "6px",
                                      background: "rgba(0,0,0,0.25)",
                                      borderRadius: "2px 0 0 2px",
                                    }}
                                  />
                                </div>
                              );
                            })()}

                            <div>
                              <p
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 600,
                                  color: "#e6e6e6",
                                  margin: "0 0 4px 0",
                                }}
                              >
                                {rental.bookTitle}
                              </p>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: "rgba(192,192,192,0.7)",
                                  margin: "0 0 8px 0",
                                }}
                              >
                                by {rental.bookAuthor}{" "}
                                <span style={{ opacity: 0.3, margin: "0 6px" }}>
                                  |
                                </span>{" "}
                                <span style={{ color: "#eed4a0" }}>
                                  👤 {rental.username || "User"}
                                </span>
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "16px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color: "rgba(192,192,192,0.5)",
                                  }}
                                >
                                  Pickup: {formatDate(rental.rentalDate)}
                                </span>
                                <span
                                  style={{
                                    fontSize: "11px",
                                    color:
                                      normalizeStatus(rental.status) ===
                                      "OVERDUE"
                                        ? "#ff9b86"
                                        : "#c4865f",
                                  }}
                                >
                                  {normalizeStatus(rental.status) === "OVERDUE"
                                    ? "Overdue since"
                                    : "Due"}
                                  : {formatDate(rental.returnDate)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <span
                              style={{
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background:
                                  normalizeStatus(rental.status) === "OVERDUE"
                                    ? "rgba(255,155,134,0.12)"
                                    : "rgba(122,184,122,0.12)",
                                border:
                                  normalizeStatus(rental.status) === "OVERDUE"
                                    ? "1px solid rgba(255,155,134,0.35)"
                                    : "1px solid rgba(122,184,122,0.35)",
                                color:
                                  normalizeStatus(rental.status) === "OVERDUE"
                                    ? "#ff9b86"
                                    : "#7ab87a",
                              }}
                            >
                              {normalizeStatus(rental.status)}
                            </span>
                            <button
                              onClick={() => handleReturn(rental.id)}
                              style={{
                                background: "transparent",
                                border: "1px solid rgba(122,184,122,0.5)",
                                color: "#7ab87a",
                                padding: "8px 20px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(122,184,122,0.1)";
                                e.currentTarget.style.borderColor = "#7ab87a";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "transparent";
                                e.currentTarget.style.borderColor =
                                  "rgba(122,184,122,0.5)";
                              }}
                            >
                              Mark Returned
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {returnedRentals.length > 0 && (
                    <>
                      <h3
                        style={{
                          color: "rgba(192,192,192,0.6)",
                          fontSize: "16px",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: "24px",
                        }}
                      >
                        Return History ({returnedRentals.length})
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          paddingBottom: "40px",
                        }}
                      >
                        {returnedRentals.map((rental) => (
                          <div
                            key={rental.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              background: "rgba(255,255,255,0.01)",
                              border: "1px solid rgba(192, 192, 192, 0.05)",
                              borderRadius: "8px",
                              padding: "16px 24px",
                              opacity: 0.6,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "24px",
                              }}
                            >
                              {(() => {
                                const matchedBook = books.find(
                                  (b) => b.title === rental.bookTitle,
                                );
                                return matchedBook?.imageUrl ? (
                                  <img
                                    src={matchedBook.imageUrl}
                                    alt="cover"
                                    style={{
                                      width: "44px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "2px 8px 8px 2px",
                                      filter: "grayscale(60%)",
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: "44px",
                                      height: "60px",
                                      background: rental.coverColor || "#555",
                                      borderRadius: "2px 8px 8px 2px",
                                      position: "relative",
                                      filter: "grayscale(60%)",
                                    }}
                                  >
                                    <div
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        bottom: 0,
                                        width: "6px",
                                        background: "rgba(0,0,0,0.25)",
                                        borderRadius: "2px 0 0 2px",
                                      }}
                                    />
                                  </div>
                                );
                              })()}

                              <div>
                                <p
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    color: "#e6e6e6",
                                    margin: "0 0 4px 0",
                                  }}
                                >
                                  {rental.bookTitle}
                                </p>
                                <p
                                  style={{
                                    fontSize: "13px",
                                    color: "rgba(192,192,192,0.7)",
                                    margin: "0 0 8px 0",
                                  }}
                                >
                                  by {rental.bookAuthor}{" "}
                                  <span
                                    style={{ opacity: 0.3, margin: "0 6px" }}
                                  >
                                    |
                                  </span>{" "}
                                  👤 {rental.username || "User"}
                                </p>
                                <div style={{ display: "flex", gap: "16px" }}>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      color: "rgba(192,192,192,0.5)",
                                    }}
                                  >
                                    Pickup: {formatDate(rental.rentalDate)}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "11px",
                                      color: "rgba(192,192,192,0.5)",
                                    }}
                                  >
                                    Returned: {formatDate(rental.returnDate)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span
                              style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 700,
                                background: "rgba(192,192,192,0.08)",
                                border: "1px solid rgba(192,192,192,0.2)",
                                color: "rgba(192,192,192,0.5)",
                              }}
                            >
                              RETURNED
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
