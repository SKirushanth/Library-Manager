import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = () => {
    if (name === "" || email === "" || password === "") {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Fake register for now
    setSuccess("Registration successful! Redirecting to login...");
    setError("");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
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
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", textAlign: "center" }}>{success}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

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
          onClick={handleRegister}
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
          Register
        </button>
      </div>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
