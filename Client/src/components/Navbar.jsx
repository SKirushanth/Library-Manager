import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "15px 30px",
        background: "#1a1a2e",
        color: "white",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
        📚 Library Manager
      </span>

      <Link to="/books" style={{ color: "white", textDecoration: "none" }}>
        Books
      </Link>

      {token && (
        <Link
          to="/dashboard"
          style={{ color: "white", textDecoration: "none" }}
        >
          Dashboard
        </Link>
      )}

      {token && role === "ADMIN" && (
        <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
          Admin
        </Link>
      )}

      <div style={{ marginLeft: "auto" }}>
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              color: "white",
              background: "none",
              border: "1px solid white",
              padding: "5px 15px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
