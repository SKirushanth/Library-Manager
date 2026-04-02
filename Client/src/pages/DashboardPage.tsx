import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Fake rental data
const fakeRentals = [
  {
    id: 1,
    bookTitle: "The Great Gatsby",
    rentalDate: "2026-03-01",
    returnDate: "2026-03-15",
  },
  {
    id: 2,
    bookTitle: "Clean Code",
    rentalDate: "2026-03-10",
    returnDate: "2026-03-24",
  },
];

function DashboardPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "0 auto" }}>
      <h2>My Dashboard</h2>
      <p style={{ color: "#555", marginBottom: "25px" }}>
        Here are your currently rented books:
      </p>

      {fakeRentals.length === 0 ? (
        <p>
          You haven't rented any books yet. <a href="/books">Browse books</a>
        </p>
      ) : (
        fakeRentals.map((rental) => (
          <div
            key={rental.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px 20px",
              marginBottom: "15px",
              borderRadius: "10px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ marginBottom: "5px" }}>{rental.bookTitle}</h3>
            <p style={{ color: "#555", fontSize: "14px" }}>
              Rented on: {rental.rentalDate}
            </p>
            <p style={{ color: "#555", fontSize: "14px" }}>
              Return by: {rental.returnDate}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default DashboardPage;
