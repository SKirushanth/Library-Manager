import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const COPPER_GRADIENT =
  "linear-gradient(100deg, #8f5637 0%, #c4865f 48%, #9b613f 100%)";
const SILVER_TEXT = "#c0c0c0";
const NAV_BG = "rgba(10, 9, 8, 0.38)";

interface NavbarProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

function GradientText({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={{
        color: SILVER_TEXT,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", show: !!token },
    { to: "/admin", label: "Admin", show: !!token && role === "ADMIN" },
  ];

  return (
    <nav
      style={{
        width: "100%",
        background: scrolled ? NAV_BG : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "74px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: scrolled
          ? "1px solid rgba(182,129,92,0.24)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 8px 22px rgba(0,0,0,0.24)" : "none",
        transition:
          "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* ── LEFT: Brand ── */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill={SILVER_TEXT}>
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
      </Link>

      {/* ── CENTER: Nav Links ── */}
      <div
        className="desktop-nav"
        style={{ display: "flex", alignItems: "center", gap: "34px" }}
      >
        {navLinks
          .filter((l) => l.show)
          .map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onMouseEnter={() => setHovered(link.to)}
              onMouseLeave={() => setHovered(null)}
              style={{
                textDecoration: "none",
                fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                fontSize: "12px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: hovered === link.to ? "#e6e6e6" : SILVER_TEXT,
                fontWeight: 600,
                position: "relative",
                paddingBottom: "6px",
              }}
            >
              {link.label}
              {/* Underline animation */}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "1px",
                  width: hovered === link.to ? "100%" : "0%",
                  background: COPPER_GRADIENT,
                  transition: "width 0.25s ease",
                  borderRadius: "2px",
                }}
              />
            </Link>
          ))}
      </div>

      {/* ── RIGHT: Auth ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {token ? (
          <button
            onClick={handleLogout}
            style={
              {
                padding: "10px 22px",
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
              } as React.CSSProperties
            }
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.86")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Logout
          </button>
        ) : (
          !isAuthRoute && (
            <>
              <button
                type="button"
                onClick={() => {
                  if (onLoginClick) {
                    onLoginClick();
                    return;
                  }
                  navigate("/login");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                  fontSize: "12px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: SILVER_TEXT,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onRegisterClick) {
                    onRegisterClick();
                    return;
                  }
                  navigate("/register");
                }}
                style={{
                  border: "none",
                  fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                  fontSize: "12px",
                  padding: "10px 22px",
                  background: COPPER_GRADIENT,
                  color: SILVER_TEXT,
                  borderRadius: "999px",
                  fontWeight: "700",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  transition: "opacity 0.2s",
                  display: "inline-block",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Register
              </button>
            </>
          )
        )}

        {/* Hamburger */}
        <button
          id="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            {menuOpen ? (
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke={SILVER_TEXT}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke={SILVER_TEXT}
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "74px",
            left: 0,
            right: 0,
            background: "rgba(10,9,8,0.95)",
            borderBottom: "1px solid rgba(192,192,192,0.28)",
            padding: "24px 48px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            zIndex: 999,
          }}
        >
          {navLinks
            .filter((l) => l.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none",
                  color: SILVER_TEXT,
                  fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                  fontSize: "13px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {link.label}
              </Link>
            ))}
          {token ? (
            <button
              onClick={handleLogout}
              style={{
                background: COPPER_GRADIENT,
                border: "none",
                padding: "10px 20px",
                borderRadius: "999px",
                cursor: "pointer",
                width: "fit-content",
                fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: SILVER_TEXT,
              }}
            >
              Logout
            </button>
          ) : (
            !isAuthRoute && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onLoginClick) {
                      onLoginClick();
                      return;
                    }
                    navigate("/login");
                  }}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: SILVER_TEXT,
                    fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                    fontSize: "13px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    if (onRegisterClick) {
                      onRegisterClick();
                      return;
                    }
                    navigate("/register");
                  }}
                  style={{
                    border: "none",
                    background: COPPER_GRADIENT,
                    padding: "10px 20px",
                    borderRadius: "999px",
                    color: SILVER_TEXT,
                    fontWeight: "700",
                    fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
                    fontSize: "12px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    display: "inline-block",
                    width: "fit-content",
                    cursor: "pointer",
                  }}
                >
                  Register
                </button>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
