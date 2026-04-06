import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  badge?: string | null;
  coverColor: string;
  spineColor: string;
}

const COPPER_GRADIENT =
  "linear-gradient(100deg, #8f5637 0%, #c4865f 48%, #9b613f 100%)";
const SILVER_TEXT = "#c0c0c0";
const SILVER_MUTED = "rgba(192, 192, 192, 0.72)";
const GOLD_GRADIENT =
  "linear-gradient(90deg, #6B3A2A 0%, #C68642 50%, #6B3A2A 100%)";

const badgeColors: Record<string, { bg: string; color: string }> = {
  BESTSELLER: { bg: "#C68642", color: "#1a0800" },
  "EDITOR'S PICK": { bg: "#e8d5b7", color: "#3a1a08" },
  "NEW ARRIVAL": { bg: "#d4a96a", color: "#1a0800" },
  "PREMIUM EXCLUSIVE": {
    bg: "linear-gradient(90deg,#6B3A2A,#C68642,#6B3A2A)",
    color: "#fff8ee",
  },
};

const isPremiumBadge = (badge?: string | null) =>
  /premium|exclusive/i.test((badge ?? "").trim());

// ── 3D Book Cover ──────────────────────────────────────────────
function BookCover({ book, size = "md" }: { book: Book; size?: "sm" | "md" }) {
  const w = size === "sm" ? 86 : 98;
  const h = size === "sm" ? 118 : 136;

  if (book.imageUrl) {
    return (
      <img
        src={book.imageUrl}
        alt={`${book.title} cover`}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          objectFit: "cover",
          borderRadius: "3px 12px 12px 3px",
          boxShadow:
            "-6px 8px 24px rgba(0,0,0,0.7), 2px 2px 6px rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: `${w}px`,
        height: `${h}px`,
        background: book.coverColor,
        borderRadius: "3px 12px 12px 3px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "-6px 8px 24px rgba(0,0,0,0.7), 2px 2px 6px rgba(255,255,255,0.06)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "12px",
          background: "rgba(0,0,0,0.28)",
          borderRadius: "3px 0 0 3px",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12px",
          top: 0,
          bottom: 0,
          width: "3px",
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill={book.spineColor}
        opacity={0.7}
      >
        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
      </svg>
    </div>
  );
}

// ── Carousel ───────────────────────────────────────────────────
function Carousel({
  books,
  onCardClick,
}: {
  books: Book[];
  onCardClick: (id: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  const ArrowBtn = ({ dir }: { dir: "left" | "right" }) => (
    <button
      onClick={() => scroll(dir)}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [dir]: "-10px",
        zIndex: 10,
        width: "42px",
        height: "52px",
        background: "transparent",
        border: "none",
        color: "rgba(222, 188, 152, 0.96)",
        fontSize: "34px",
        fontWeight: 800,
        lineHeight: 1,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textShadow: "0 4px 16px rgba(0,0,0,0.6)",
        transition: "color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#f3d5b4";
        e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(222, 188, 152, 0.95)";
        e.currentTarget.style.transform = "translateY(-50%) scale(1)";
      }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );

  return (
    <div style={{ position: "relative", padding: "0 24px" }}>
      <ArrowBtn dir="left" />
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "24px",
          overflowX: "auto",
          overflowY: "visible",
          paddingTop: "14px",
          paddingBottom: "20px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          alignItems: "center",
        }}
      >
        {books.map((book) => {
          const available = book.copiesAvailable > 0;
          const isHovered = hoveredId === book.id;

          return (
            <div
              key={book.id}
              onMouseEnter={() => setHoveredId(book.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: "relative",
                flexShrink: 0,
                height: "248px",
                width: isHovered ? "429px" : "165px",
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                overflow: "visible",
              }}
            >
              {/* Left: 3D book */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "165px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    width: "112px",
                    height: "163px",
                    background: book.coverColor,
                    borderRadius: "4px 12px 12px 4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    transform: isHovered
                      ? "scale(1.07) rotate(-3deg)"
                      : "scale(1) rotate(0deg)",
                    boxShadow: isHovered
                      ? "-10px 12px 32px rgba(0,0,0,0.85)"
                      : "-6px 8px 20px rgba(0,0,0,0.7)",
                    overflow: "hidden",
                  }}
                >
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={`${book.title} cover`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "12px",
                          background: "rgba(0,0,0,0.28)",
                          borderRadius: "3px 0 0 3px",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: 0,
                          bottom: 0,
                          width: "2px",
                          background: "rgba(255,255,255,0.1)",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "3px 10px 10px 3px",
                          background: isHovered
                            ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)"
                            : "transparent",
                          transition: "background 0.4s ease",
                        }}
                      />
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill={book.spineColor}
                        opacity={0.65}
                      >
                        <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
                      </svg>
                    </>
                  )}
                </div>

                {book.badge && badgeColors[book.badge] && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: badgeColors[book.badge].bg,
                      color: badgeColors[book.badge].color,
                      fontSize: "7px",
                      fontWeight: "800",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      letterSpacing: "0.5px",
                      whiteSpace: "nowrap",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {book.badge}
                  </span>
                )}
              </div>

              {/* Right: Info panel */}
              <div
                style={{
                  position: "absolute",
                  left: "165px",
                  top: "4px",
                  bottom: "4px",
                  width: "264px",
                  padding: "22px 20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "8px",
                  background: "rgba(12,8,4,0.76)",
                  borderRadius: "14px",
                  border: "1px solid rgba(198,134,66,0.18)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? "translateX(0)" : "translateX(24px)",
                  transition:
                    "opacity 0.25s ease 0.15s, transform 0.25s ease 0.15s",
                  pointerEvents: isHovered ? "auto" : "none",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "52px",
                      borderRadius: "3px 8px 8px 3px",
                      boxShadow: "-4px 5px 12px rgba(0,0,0,0.45)",
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                      background: book.coverColor,
                    }}
                  >
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={`${book.title} thumbnail`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "7px",
                            background: "rgba(0,0,0,0.28)",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill={book.spineColor}
                            opacity={0.65}
                          >
                            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        margin: "0 0 3px",
                        lineHeight: 1.25,
                        fontFamily: "Inter, sans-serif",
                        color: SILVER_TEXT,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {book.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: SILVER_MUTED,
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      by {book.author}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, rgba(198,134,66,0.4), transparent)",
                  }}
                />
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#C68642",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    ⭐ {book.rating}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: SILVER_MUTED,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {book.pages}p
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "Inter, sans-serif",
                      color: available ? "#7ab87a" : "#b87a7a",
                    }}
                  >
                    {available ? `${book.copiesAvailable} left` : "unavailable"}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (available) onCardClick(book.id);
                  }}
                  disabled={!available}
                  style={{
                    marginTop: "6px",
                    padding: "9px 16px",
                    background: available
                      ? COPPER_GRADIENT
                      : "rgba(255,255,255,0.05)",
                    color: available ? "#fff8ee" : SILVER_MUTED,
                    border: `1px solid ${available ? "transparent" : "rgba(192,192,192,0.15)"}`,
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: available ? "pointer" : "not-allowed",
                    letterSpacing: "0.5px",
                    fontFamily: "Inter, sans-serif",
                    transition: "opacity 0.2s",
                    alignSelf: "flex-start",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    if (available) e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    if (available) e.currentTarget.style.opacity = "1";
                  }}
                >
                  {available ? "Reserve & Collect →" : "Not Available"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ArrowBtn dir="right" />
    </div>
  );
}

// ── Premium Exclusives Section ─────────────────────────────────
function AudibleExclusivesSection({
  books,
  onCardClick,
}: {
  books: Book[];
  onCardClick: (id: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % books.length);

  const getOffset = (index: number) => {
    const total = books.length;
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const getStyle = (offset: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      borderRadius: "16px",
      overflow: "hidden",
    };

    if (offset === 0)
      return {
        ...base,
        width: "260px",
        height: "360px",
        left: "50%",
        top: "0",
        transform: "translateX(-50%) scale(1)",
        zIndex: 5,
        opacity: 1,
      };
    if (offset === -1 || offset === 1)
      return {
        ...base,
        width: "200px",
        height: "300px",
        left: offset === -1 ? "calc(50% - 260px)" : "calc(50% + 60px)",
        top: "30px",
        transform: "scale(0.88)",
        zIndex: 4,
        opacity: 0.75,
      };
    if (offset === -2 || offset === 2)
      return {
        ...base,
        width: "160px",
        height: "240px",
        left: offset === -2 ? "calc(50% - 380px)" : "calc(50% + 220px)",
        top: "60px",
        transform: "scale(0.75)",
        zIndex: 3,
        opacity: 0.45,
      };
    return {
      ...base,
      width: "160px",
      height: "240px",
      left: "50%",
      top: "60px",
      transform: "translateX(-50%) scale(0.55)",
      opacity: 0,
      pointerEvents: "none",
      zIndex: 0,
    };
  };

  if (books.length === 0) return null;

  return (
    <div style={{ marginBottom: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
          }}
        >
          <div
            style={{ height: "1px", width: "32px", background: GOLD_GRADIENT }}
          />
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              background: GOLD_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Only from The Reader's Nook
          </p>
          <div
            style={{ height: "1px", width: "32px", background: GOLD_GRADIENT }}
          />
        </div>
        <h2
          style={{
            fontSize: "clamp(24px, 3vw, 38px)",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 10px",
            fontFamily: "Inter, sans-serif",
            background: GOLD_GRADIENT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Premium Exclusive Collection
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: SILVER_MUTED,
            fontFamily: "Inter, sans-serif",
            margin: 0,
          }}
        >
          Handpicked titles you won't find anywhere else.
        </p>
      </div>

      {/* Spotlight carousel */}
      <div
        style={{
          position: "relative",
          height: "420px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Left arrow */}
        <button
          onClick={goPrev}
          style={{
            position: "absolute",
            left: "0",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "42px",
            height: "52px",
            background: "transparent",
            border: "none",
            color: "rgba(222, 188, 152, 0.96)",
            fontSize: "34px",
            fontWeight: 800,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textShadow: "0 4px 16px rgba(0,0,0,0.6)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f3d5b4";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(222, 188, 152, 0.95)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ‹
        </button>

        {/* Cards */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {books.map((book, index) => {
            const offset = getOffset(index);
            const cardStyle = getStyle(offset);
            const isCenter = offset === 0;

            return (
              <div
                key={book.id}
                style={cardStyle}
                onClick={() => {
                  if (isCenter) onCardClick(book.id);
                  else setCurrentIndex(index);
                }}
              >
                {/* Cover art */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: book.imageUrl
                      ? `linear-gradient(160deg, ${book.spineColor} 0%, ${book.coverColor} 54%, ${book.spineColor} 100%)`
                      : `linear-gradient(160deg, ${book.spineColor} 0%, ${book.coverColor} 54%, ${book.spineColor} 100%)`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "24px",
                    position: "relative",
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
                        zIndex: 0,
                      }}
                    />
                  )}
                  {/* Sheen */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />

                  {/* Premium badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      background: GOLD_GRADIENT,
                      color: "#fff8ee",
                      fontSize: "8px",
                      fontWeight: "800",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      letterSpacing: "0.8px",
                      fontFamily: "Inter, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      zIndex: 2,
                    }}
                  >
                    ★ PREMIUM EXCLUSIVE
                  </span>

                  {/* Title & author */}
                  <div
                    style={{ position: "relative", zIndex: 1, width: "100%" }}
                  >
                    <p
                      style={{
                        fontSize: isCenter ? "18px" : "14px",
                        fontWeight: 800,
                        color: "#fff",
                        margin: "0 0 4px",
                        fontFamily: "Inter, sans-serif",
                        lineHeight: 1.2,
                        transition: "font-size 0.3s ease",
                      }}
                    >
                      {book.title}
                    </p>
                    <p
                      style={{
                        fontSize: isCenter ? "12px" : "10px",
                        color: "rgba(255,255,255,0.7)",
                        margin: 0,
                        fontFamily: "Inter, sans-serif",
                        transition: "font-size 0.3s ease",
                      }}
                    >
                      {book.author}
                    </p>

                    {/* Rent button only on center card */}
                    {isCenter && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCardClick(book.id);
                        }}
                        style={{
                          marginTop: "14px",
                          padding: "9px 20px",
                          background: COPPER_GRADIENT,
                          color: "#fff8ee",
                          border: "none",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          letterSpacing: "0.5px",
                          transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = "0.85")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = "1")
                        }
                      >
                        Reserve & Collect →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={goNext}
          style={{
            position: "absolute",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            width: "42px",
            height: "52px",
            background: "transparent",
            border: "none",
            color: "rgba(222, 188, 152, 0.96)",
            fontSize: "34px",
            fontWeight: 800,
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textShadow: "0 4px 16px rgba(0,0,0,0.6)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f3d5b4";
            e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(222, 188, 152, 0.95)";
            e.currentTarget.style.transform = "translateY(-50%) scale(1)";
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────
function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [premiumBooks, setPremiumBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/books")
      .then((res) => {
        const all: Book[] = res.data;
        const premium = all.filter((b) => isPremiumBadge(b.badge));
        const premiumFallback =
          premium.length > 0
            ? premium
            : [...all]
                .filter((b) => b.copiesAvailable > 0)
                .sort((a, b) => b.rating - a.rating)
                .slice(0, Math.min(6, all.length));

        setPremiumBooks(premiumFallback);
        setBooks(all);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()),
  );

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

      {/* Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "118px 24px 42px",
        }}
      >
        <div style={{ maxWidth: "1040px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(46px, 5.8vw, 96px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              marginBottom: "18px",
              fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
              color: SILVER_TEXT,
            }}
          >
            Discover Your Next Great Story
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2vw, 21px)",
              lineHeight: 1.65,
              margin: "0 auto 34px",
              maxWidth: "760px",
              fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
              color: SILVER_MUTED,
              fontWeight: 400,
            }}
          >
            Curated classics, modern favorites, and timeless knowledge in one
            premium reading destination.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("books-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minWidth: "250px",
              padding: "15px 32px",
              background: COPPER_GRADIENT,
              color: SILVER_TEXT,
              border: "none",
              borderRadius: "999px",
              fontSize: "12px",
              fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
              cursor: "pointer",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z" />
            </svg>
            Browse Books
          </button>
        </div>
      </div>

      {/* Books section */}
      <div
        id="books-section"
        style={{ position: "relative", zIndex: 2, padding: "60px 48px 100px" }}
      >
        {/* Section 1: Main carousel */}
        <div style={{ marginBottom: "72px" }}>
          <div style={{ marginBottom: "32px" }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#C68642",
                marginBottom: "8px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
              }}
            >
              Our Library
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 3.5vw, 42px)",
                fontWeight: 800,
                lineHeight: 1.1,
                margin: "0 0 10px",
                fontFamily: "Inter, sans-serif",
                color: SILVER_TEXT,
              }}
            >
              We've got what everyone's reading
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: SILVER_MUTED,
                fontFamily: "Inter, sans-serif",
                margin: 0,
              }}
            >
              {loading
                ? "Loading..."
                : `${books.length} books available — Bestsellers. New releases. That story you've been waiting for.`}
            </p>
          </div>

          {/* Search */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <input
                type="text"
                placeholder="Search title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "10px 20px 10px 40px",
                  width: "280px",
                  borderRadius: "30px",
                  border: "1px solid rgba(192,192,192,0.25)",
                  fontSize: "13px",
                  background: "rgba(15,10,5,0.7)",
                  color: SILVER_TEXT,
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke={SILVER_MUTED}
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* Carousel or search grid */}
          {search ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/books/${book.id}`)}
                    style={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 0",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-6px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      style={{
                        height: "130px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BookCover book={book} size="sm" />
                    </div>
                    <div style={{ padding: "0 8px", textAlign: "center" }}>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: SILVER_TEXT,
                          margin: "0 0 2px",
                          fontFamily: "Inter, sans-serif",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "180px",
                        }}
                      >
                        {book.title}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: SILVER_MUTED,
                          margin: 0,
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: SILVER_MUTED,
                    fontFamily: "Inter, sans-serif",
                    gridColumn: "1/-1",
                  }}
                >
                  No books found matching "{search}"
                </p>
              )}
            </div>
          ) : (
            <Carousel
              books={books}
              onCardClick={(id) => navigate(`/books/${id}`)}
            />
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(198,134,66,0.4), transparent)",
            marginBottom: "72px",
          }}
        />

        {/* Section 2: Premium */}
        <AudibleExclusivesSection
          books={premiumBooks}
          onCardClick={(id) => navigate(`/books/${id}`)}
        />
      </div>
    </div>
  );
}

export default BooksPage;
