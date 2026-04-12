import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Silk from "../components/Silk";
import type { AuthMode, AuthRoutePageProps } from "../types";

function AuthRoutePage({ initialMode }: AuthRoutePageProps) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setAuthMode(initialMode);
    setError("");
    setSuccess("");
  }, [initialMode]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, role, userId, name: userName } = response.data;
      login(token, role, userId, userName);
      setError("");
      setSuccess("Welcome back. Redirecting...");
      window.setTimeout(() => {
        navigate(role === "ADMIN" ? "/admin" : "/books");
      }, 420);
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Try again.");
      }
      setSuccess("");
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setSuccess("");
      return;
    }

    try {
      await api.post("/auth/register", { name, email, password });
      setError("");
      setSuccess("Registration successful. Please sign in.");
      window.setTimeout(() => {
        setAuthMode("login");
        setPassword("");
      }, 450);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError("Email already registered.");
      } else {
        setError("Registration failed. Try again.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="auth-route-shell">
      <div className="auth-route-silk-layer">
        <Silk
          color="#22201f"
          speed={1.8}
          scale={1.2}
          noiseIntensity={1.4}
          rotation={0.08}
        />
      </div>
      <div className="auth-route-grain-overlay" />

      <div className="auth-route-wrap">
        <div className="auth-modal auth-route-card">
          <p className="auth-kicker">Access Your Library</p>
          <h2>{authMode === "login" ? "Welcome Back" : "Create Account"}</h2>

          <div className="auth-panels-viewport auth-route-panels-viewport">
            <div
              className="auth-panels-track"
              style={{
                transform:
                  authMode === "login" ? "translateX(0%)" : "translateX(-50%)",
              }}
            >
              <form
                className="auth-panel"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <label htmlFor="route-email-login">Email</label>
                <input
                  id="route-email-login"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="route-password-login">Password</label>
                <input
                  id="route-password-login"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="auth-submit auth-route-submit">
                  Login
                </button>
              </form>

              <form
                className="auth-panel"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <label htmlFor="route-name-register">Full Name</label>
                <input
                  id="route-name-register"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="route-email-register">Email</label>
                <input
                  id="route-email-register"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="route-password-register">Password</label>
                <input
                  id="route-password-register"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className="auth-submit auth-route-submit">
                  Register
                </button>
              </form>
            </div>
          </div>

          {(error || success) && (
            <p className={`auth-feedback ${error ? "is-error" : "is-success"}`}>
              {error || success}
            </p>
          )}

          <button
            type="button"
            className="auth-toggle"
            onClick={() => {
              setError("");
              setSuccess("");
              setAuthMode((prev) => (prev === "login" ? "register" : "login"));
            }}
          >
            {authMode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthRoutePage;
