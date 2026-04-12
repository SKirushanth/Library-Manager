import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Silk from "../components/Silk";
import type { Rental } from "../types";

function DashboardPage() {
  const { token, userName } = useAuth();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/rentals/my")
      .then((res) => {
        setRentals(res.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  const stats = useMemo(
    () => [
      { label: "Total Rented", value: rentals.length },
      {
        label: "Active",
        value: rentals.filter((r) => r.status === "ACTIVE").length,
      },
      {
        label: "Returned",
        value: rentals.filter((r) => r.status === "RETURNED").length,
      },
    ],
    [rentals],
  );

  return (
    <div className="dashboard-page-shell">
      <div className="dashboard-silk-layer">
        <Silk
          color="#22201f"
          speed={1.8}
          scale={1.2}
          noiseIntensity={1.4}
          rotation={0.08}
        />
      </div>

      <div className="dashboard-grain-overlay" />

      <div className="dashboard-page-wrap">
        <header className="dashboard-header">
          <p className="dashboard-kicker">My Account</p>
          <h1 className="dashboard-title">
            Welcome back{userName ? `, ${userName}` : ""}
          </h1>
          <p className="dashboard-subtitle">
            Here are your currently rented books
          </p>
        </header>

        <div className="dashboard-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-stat-card">
              <span className="dashboard-stat-value">{stat.value}</span>
              <span className="dashboard-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="dashboard-divider" />

        {loading ? (
          <p className="dashboard-empty-text">Loading...</p>
        ) : rentals.length === 0 ? (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-text">
              You haven't rented any books yet.
            </p>
            <button
              onClick={() => navigate("/books")}
              className="dashboard-primary-btn"
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div className="dashboard-rentals-list">
            {rentals.map((rental) => (
              <article key={rental.id} className="dashboard-rental-card">
                <div
                  className="dashboard-book-spine"
                  style={{ background: rental.coverColor || "#C68642" }}
                >
                  <div className="dashboard-book-spine-edge" />
                </div>

                <div className="dashboard-rental-meta">
                  <p className="dashboard-book-title">{rental.bookTitle}</p>
                  <p className="dashboard-book-author">
                    by {rental.bookAuthor}
                  </p>
                  <div className="dashboard-rental-dates">
                    <span>Rented: {rental.rentalDate}</span>
                    <span>Return by: {rental.returnDate}</span>
                  </div>
                </div>

                <span
                  className={`dashboard-status-badge ${
                    rental.status === "ACTIVE"
                      ? "dashboard-status-active"
                      : "dashboard-status-returned"
                  }`}
                >
                  {rental.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
