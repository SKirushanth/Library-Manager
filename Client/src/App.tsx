import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BooksDetailPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import AdminPage from "./pages/AdminPage";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext.tsx";
import api from "./services/api";
import type { AuthMode } from "./types";
import "./App.css";

function App() {
  const { login, role } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const resetAuthFields = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAuthError("");
    setAuthSuccess("");
  };

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsClosing(false);
    setIsAuthOpen(true);
    setAuthError("");
    setAuthSuccess("");
  };

  const closeAuth = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsAuthOpen(false);
      setIsClosing(false);
      resetAuthFields();
    }, 240);
  };

  const navigateInApp = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleLoginSubmit = async () => {
    if (!email || !password) {
      setAuthError("Please fill in all fields.");
      setAuthSuccess("");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role: userRole, userId, name: userName } = response.data;
      login(token, userRole, userId, userName);
      setAuthError("");
      setAuthSuccess("Welcome back. Redirecting...");

      window.setTimeout(() => {
        closeAuth();
        navigateInApp(userRole === "ADMIN" ? "/admin" : "/books");
      }, 500);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setAuthError("Invalid email or password.");
      } else {
        setAuthError("Something went wrong. Try again.");
      }
      setAuthSuccess("");
    }
  };

  const handleRegisterSubmit = async () => {
    if (!name || !email || !password) {
      setAuthError("Please fill in all fields.");
      setAuthSuccess("");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      setAuthSuccess("");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      setAuthError("");
      setAuthSuccess("Registration successful. Please sign in.");
      window.setTimeout(() => {
        setAuthMode("login");
        setPassword("");
      }, 450);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setAuthError("Email already registered.");
      } else {
        setAuthError("Registration failed. Try again.");
      }
      setAuthSuccess("");
    }
  };

  useEffect(() => {
    if (!isAuthOpen) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAuth();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isAuthOpen]);

  useEffect(() => {
    document.body.style.overflow = isAuthOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      {!isAdminRoute && (
        <Navbar
          onLoginClick={() => openAuth("login")}
          onRegisterClick={() => openAuth("register")}
        />
      )}

      {isAuthOpen && (
        <div
          className={`auth-overlay ${isClosing ? "is-closing" : ""}`}
          onClick={closeAuth}
        >
          <div
            className={`auth-modal ${isClosing ? "is-closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-close"
              onClick={closeAuth}
              aria-label="Close authentication"
            >
              ×
            </button>

            <p className="auth-kicker">Access Your Library</p>
            <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>

            <div className="auth-panels-viewport">
              <div
                className="auth-panels-track"
                style={{
                  transform:
                    authMode === "login"
                      ? "translateX(0%)"
                      : "translateX(-50%)",
                }}
              >
                <form
                  className="auth-panel"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLoginSubmit();
                  }}
                >
                  <label htmlFor="overlay-email-login">Email</label>
                  <input
                    id="overlay-email-login"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label htmlFor="overlay-password-login">Password</label>
                  <input
                    id="overlay-password-login"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit" className="auth-submit">
                    Login
                  </button>
                </form>

                <form
                  className="auth-panel"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegisterSubmit();
                  }}
                >
                  <label htmlFor="overlay-name-register">Full Name</label>
                  <input
                    id="overlay-name-register"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label htmlFor="overlay-email-register">Email</label>
                  <input
                    id="overlay-email-register"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <label htmlFor="overlay-password-register">Password</label>
                  <input
                    id="overlay-password-register"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit" className="auth-submit">
                    Register
                  </button>
                </form>
              </div>
            </div>

            {(authError || authSuccess) && (
              <p
                className={`auth-feedback ${authError ? "is-error" : "is-success"}`}
              >
                {authError || authSuccess}
              </p>
            )}

            <button
              type="button"
              className="auth-toggle"
              onClick={() => {
                setAuthError("");
                setAuthSuccess("");
                setAuthMode((prev) =>
                  prev === "login" ? "register" : "login",
                );
              }}
            >
              {authMode === "login"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      )}

      <div>
        <Routes>
          <Route
            path="/"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <BooksPage />
              )
            }
          />
          <Route
            path="/login"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route
            path="/register"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <RegisterPage />
              )
            }
          />
          <Route
            path="/books"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <BooksPage />
              )
            }
          />
          <Route
            path="/books/:id"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <BookDetailPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/my-library" replace />
              )
            }
          />
          <Route
            path="/my-library"
            element={
              role === "ADMIN" ? (
                <Navigate to="/admin" replace />
              ) : (
                <MyLibraryPage />
              )
            }
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
