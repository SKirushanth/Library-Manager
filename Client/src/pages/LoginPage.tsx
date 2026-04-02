import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Basic validation
    if (email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    // Fake login for now — we'll connect to backend later
    // Simulating an admin login if email contains 'admin'
    if (email === "admin@library.com" && password === "admin123") {
      login("fake-token", "ADMIN");
      navigate("/admin");
    } else {
      login("fake-token", "USER");
      navigate("/books");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

      {/* Show error message if there is one */}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            padding: "10px",
            fontSize: "16px",
            background: "#1a1a2e",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;
