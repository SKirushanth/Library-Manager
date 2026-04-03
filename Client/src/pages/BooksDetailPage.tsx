import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Silk from "../components/Silk";
import api from "../services/api";

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  copiesAvailable: number;
  pages: number;
  rating: number;
  imageUrl?: string | null;
  genre: string;
  published: string;
  coverColor: string;
  spineColor: string;
  badge?: string | null;
}

const COPPER_GRADIENT =
  "linear-gradient(100deg, #8f5637 0%, #c4865f 48%, #9b613f 100%)";
const GOLD_GRADIENT =
  "linear-gradient(90deg, #6B3A2A 0%, #C68642 50%, #6B3A2A 100%)";
const SILVER_TEXT = "#c0c0c0";
const SILVER_MUTED = "rgba(192,192,192,0.72)";

const badgeColors: Record<string, { bg: string; color: string }> = {
  BESTSELLER: { bg: "#C68642", color: "#1a0800" },
  "EDITOR'S PICK": { bg: "#e8d5b7", color: "#3a1a08" },
  "NEW ARRIVAL": { bg: "#d4a96a", color: "#1a0800" },
  "PREMIUM EXCLUSIVE": {
    bg: "linear-gradient(90deg,#6B3A2A,#C68642,#6B3A2A)",
    color: "#fff8ee",
  },
};

function BookDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [rented, setRented] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(""); 

  // Fetch current book
  useEffect(() => {
    setLoading(true);
    setMessage("");
    setRented(false);
    api
      .get(`/books/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Fetch all books for "Also in our collection"
  useEffect(() => {
    api.get("/books").then((res) => setAllBooks(res.data));
  }, []);

  // ── Loading state ──
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <Silk
            color="#22201f"
            speed={1.8}
            scale={1.2}
            noiseIntensity={1.4}
            rotation={0.08}
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <p
            style={{
              color: SILVER_MUTED,
              fontFamily: "Inter, sans-serif",
              fontSize: "16px",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!book) {
    return (
      <div style={{ minHeight: "100vh", position: "relative" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <Silk
            color="#22201f"
            speed={1.8}
            scale={1.2}
            noiseIntensity={1.4}
            rotation={0.08}
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "16px",
          }}
        >
          <p
            style={{
              color: SILVER_MUTED,
              fontSize: "18px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Book not found.
          </p>
          <button
            onClick={() => navigate("/books")}
            style={{
              padding: "10px 24px",
              background: COPPER_GRADIENT,
              color: "#fff8ee",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            }}
          >
            ← Back to Books
          </button>
        </div>
      </div>
    );
  }

  // ── Derived state — defined AFTER book is confirmed not null ──
  const available = book.copiesAvailable > 0;

  // ── Rent handler — real API call ──
  const handleRent = async () => {
    if (!token) {
      setMessage("Please login to rent this book.");
      setMessageType("error");
      return;
    }

    try {
      await api.post("/rentals", { bookId: Number(id) });
      setRented(true);
      setMessage(
        "Book rented successfully! A confirmation email will be sent to you shortly."
      );
      setMessageType("success");
      // Update local copy count
      setBook((prev) =>
        prev ? { ...prev, copiesAvailable: prev.copiesAvailable - 1 } : prev
      );
    } catch (err: any) {
      if (err.response?.status === 400) {
        setMessage("No copies available right now.");
      } else if (err.response?.status === 401) {
        setMessage("Please login to rent this book.");
      } else {
        setMessage("Failed to rent. Please try again.");
      }
      setMessageType("error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>

      {/* Silk background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <Silk
          color="#22201f"
          speed={1.8}
          scale={1.2}
          noiseIntensity={1.4}
          rotation={0.08}
        />
      </div>

      {/* Texture overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse at 12% 16%, rgba(255,236,221,0.08) 0%, transparent 44%), radial-gradient(ellipse at 88% 14%, rgba(255,210,175,0.07) 0%, transparent 38%), repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 6px)",
          pointerEvents: "none",
        }}
      />

      {/* Page content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          padding: "100px 48px 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Back button */}
        <div
          style={{ width: "100%", maxWidth: "900px", marginBottom: "32px" }}
        >
          <button
            onClick={() => navigate("/books")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(15,10,5,0.6)",
              border: "1px solid rgba(198,134,66,0.25)",
              borderRadius: "20px",
              padding: "8px 18px",
              color: SILVER_MUTED,
              fontSize: "13px",
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(198,134,66,0.6)";
              e.currentTarget.style.color = "#C68642";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(198,134,66,0.25)";
              e.currentTarget.style.color = SILVER_MUTED;
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Books
          </button>
        </div>

        {/* Main card */}
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            background: "rgba(12,8,4,0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(198,134,66,0.25)",
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          {/* Top gold banner */}
          <div style={{ height: "6px", background: GOLD_GRADIENT }} />

          <div
            style={{
              padding: "40px 48px",
              display: "flex",
              gap: "48px",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT: 3D Book cover */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                flexShrink: 0,
              }}
            >
              <div style={{ position: "relative" }}>
                {/* Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: "-20px",
                    background: `radial-gradient(ellipse, ${book.coverColor}22 0%, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />
                {/* 3D Cover */}
                <div
                  style={{
                    width: "160px",
                    height: "220px",
                    background: book.coverColor,
                    borderRadius: "4px 16px 16px 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "-12px 16px 48px rgba(0,0,0,0.85), 4px 4px 16px rgba(255,255,255,0.05)",
                    position: "relative",
                    transform: "perspective(600px) rotateY(-8deg)",
                    overflow: "hidden",
                  }}
                >
                  {book.imageUrl && (
                    <img
                      src={book.imageUrl}
                      alt={`${book.title} cover`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: "18px",
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: "4px 0 0 4px",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      left: "18px",
                      top: 0,
                      bottom: 0,
                      width: "3px",
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "-4px",
                      top: "4px",
                      bottom: "4px",
                      width: "6px",
                      background: "rgba(240,230,210,0.6)",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "4px 16px 16px 4px",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 45%)",
                    }}
                  />
                  {!book.imageUrl && (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill={book.spineColor}
                      opacity={0.55}
                    >
                      <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Badge */}
              {book.badge && badgeColors[book.badge] && (
                <span
                  style={{
                    background: badgeColors[book.badge].bg,
                    color: badgeColors[book.badge].color,
                    fontSize: "9px",
                    fontWeight: "800",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    letterSpacing: "1px",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {book.badge}
                </span>
              )}

              {/* Availability pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  background: available
                    ? "rgba(122,184,122,0.1)"
                    : "rgba(184,122,122,0.1)",
                  border: `1px solid ${available ? "rgba(122,184,122,0.35)" : "rgba(184,122,122,0.35)"}`,
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: available ? "#7ab87a" : "#b87a7a",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    color: available ? "#7ab87a" : "#b87a7a",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {available
                    ? `${book.copiesAvailable} copies available`
                    : "Currently unavailable"}
                </span>
              </div>
            </div>

            {/* RIGHT: Book details */}
            <div
              style={{
                flex: 1,
                minWidth: "260px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Title & author */}
              <div>
                <h1
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 38px)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    margin: "0 0 10px",
                    fontFamily: 'Inter, "Segoe UI", sans-serif',
                    background: GOLD_GRADIENT,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {book.title}
                </h1>
                <p
                  style={{
                    fontSize: "16px",
                    color: SILVER_MUTED,
                    margin: 0,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  by{" "}
                  <span style={{ color: SILVER_TEXT, fontWeight: 600 }}>
                    {book.author}
                  </span>
                </p>
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(198,134,66,0.15)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {[
                  { icon: "⭐", val: book.rating, label: "Rating" },
                  { icon: "📄", val: book.pages, label: "Pages" },
                  { icon: "📅", val: book.published, label: "Published" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      flex: 1,
                      padding: "14px 12px",
                      textAlign: "center",
                      borderRight:
                        i < 2
                          ? "1px solid rgba(198,134,66,0.12)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "18px",
                        marginBottom: "4px",
                      }}
                    >
                      {stat.icon}
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#C68642",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      {stat.val}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        color: SILVER_MUTED,
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Genre tag */}
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: "rgba(198,134,66,0.1)",
                    border: "1px solid rgba(198,134,66,0.3)",
                    color: "#C68642",
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  {book.genre}
                </span>
              </div>

              {/* Gold divider */}
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(90deg, rgba(198,134,66,0.5), transparent)",
                }}
              />

              {/* Description */}
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: 1.75,
                  color: SILVER_MUTED,
                  margin: 0,
                  fontFamily: 'Inter, "Segoe UI", sans-serif',
                }}
              >
                {book.description}
              </p>

              {/* Message */}
              {message && (
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background:
                      messageType === "success"
                        ? "rgba(122,184,122,0.08)"
                        : "rgba(184,122,122,0.08)",
                    border: `1px solid ${messageType === "success" ? "rgba(122,184,122,0.3)" : "rgba(184,122,122,0.3)"}`,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "16px", flexShrink: 0 }}>
                    {messageType === "success" ? "✅" : "⚠️"}
                  </span>
                  <p
                    style={{
                      fontSize: "13px",
                      margin: 0,
                      color:
                        messageType === "success" ? "#7ab87a" : "#b87a7a",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.5,
                    }}
                  >
                    {message}
                  </p>
                </div>
              )}

              {/* CTA buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "4px",
                }}
              >
                <button
                  onClick={handleRent}
                  disabled={!available || rented}
                  style={{
                    padding: "13px 32px",
                    background:
                      !available || rented
                        ? "rgba(255,255,255,0.06)"
                        : COPPER_GRADIENT,
                    color:
                      !available || rented ? SILVER_MUTED : "#fff8ee",
                    border: "none",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor:
                      !available || rented ? "not-allowed" : "pointer",
                    letterSpacing: "0.5px",
                    fontFamily: "Inter, sans-serif",
                    transition: "opacity 0.2s, transform 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    if (available && !rented) {
                      e.currentTarget.style.opacity = "0.85";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
                  </svg>
                  {rented ? "Rented ✓" : !available ? "Not Available" : "Rent this Book"}
                </button>

                <button
                  onClick={() => navigate("/books")}
                  style={{
                    padding: "13px 24px",
                    background: "transparent",
                    color: SILVER_MUTED,
                    border: "1px solid rgba(192,192,192,0.2)",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(198,134,66,0.5)";
                    e.currentTarget.style.color = "#C68642";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(192,192,192,0.2)";
                    e.currentTarget.style.color = SILVER_MUTED;
                  }}
                >
                  Browse More
                </button>
              </div>
            </div>
          </div>

          {/* Also in our collection */}
          <div
            style={{
              borderTop: "1px solid rgba(198,134,66,0.15)",
              padding: "28px 48px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#C68642",
                margin: "0 0 20px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              Also in our collection
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                overflowX: "auto",
                scrollbarWidth: "none",
                paddingBottom: "4px",
              }}
            >
              {allBooks
                .filter((b) => b.id !== book.id)
                .slice(0, 6)
                .map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      navigate(`/books/${b.id}`);
                      setMessage("");
                      setRented(false);
                    }}
                    style={{
                      flexShrink: 0,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      transition: "transform 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-4px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {/* Mini 3D book */}
                    <div
                      style={{
                        width: "52px",
                        height: "72px",
                        background: b.coverColor,
                        borderRadius: "2px 8px 8px 2px",
                        position: "relative",
                        boxShadow: "-4px 5px 14px rgba(0,0,0,0.7)",
                        transform: "perspective(400px) rotateY(-6deg)",
                        overflow: "hidden",
                      }}
                    >
                      {b.imageUrl && (
                        <img
                          src={b.imageUrl}
                          alt={`${b.title} cover`}
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "7px",
                          background: "rgba(0,0,0,0.28)",
                          borderRadius: "2px 0 0 2px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "2px 8px 8px 2px",
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "10px",
                        color: SILVER_MUTED,
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                        textAlign: "center",
                        maxWidth: "64px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {b.title}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;