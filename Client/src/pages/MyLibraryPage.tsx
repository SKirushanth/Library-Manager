import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Silk from "../components/Silk";
import type { Rental } from "../types";

const COPPER = "#c4865f";
const SILVER_MUTED = "rgba(192,192,192,0.7)";

const ACTIVE_STATUSES = new Set(["RESERVED", "PICKED_UP", "OVERDUE", "ACTIVE"]);

const normalizeStatus = (status: string) =>
  status === "ACTIVE" ? "PICKED_UP" : status;

const formatDate = (value: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value: string | null) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const statusStyles: Record<
  string,
  { color: string; border: string; bg: string }
> = {
  RESERVED: {
    color: "#f0c07f",
    border: "rgba(240,192,127,0.35)",
    bg: "rgba(240,192,127,0.12)",
  },
  PICKED_UP: {
    color: "#8bcf8b",
    border: "rgba(139,207,139,0.3)",
    bg: "rgba(139,207,139,0.12)",
  },
  OVERDUE: {
    color: "#ff9b86",
    border: "rgba(255,155,134,0.35)",
    bg: "rgba(255,155,134,0.12)",
  },
};

function MyLibraryPage() {
  const { token, userName } = useAuth();
  const navigate = useNavigate();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/rentals/my")
      .then((res) => {
        setRentals(res.data ?? []);
        setLoadError("");
        setLoading(false);
      })
      .catch((err) => {
        const message = err?.response?.data?.error || "Failed to load rentals.";
        setLoadError(message);
        setLoading(false);
      });
  }, [token, navigate]);

  const activeReservations = useMemo(
    () =>
      rentals
        .filter((r) => ACTIVE_STATUSES.has(r.status))
        .map((r) => ({ ...r, status: normalizeStatus(r.status) })),
    [rentals],
  );

  const stats = useMemo(
    () => [
      {
        label: "Reserved",
        value: activeReservations.filter((r) => r.status === "RESERVED").length,
      },
      {
        label: "Picked Up",
        value: activeReservations.filter((r) => r.status === "PICKED_UP")
          .length,
      },
      {
        label: "Overdue",
        value: activeReservations.filter((r) => r.status === "OVERDUE").length,
      },
    ],
    [activeReservations],
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        background: "#0a0908",
      }}
    >
      <div style={{ position: "fixed", inset: 0, zIndex: 0, opacity: 0.6 }}>
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
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 16% 8%, rgba(196,134,95,0.18) 0%, transparent 40%), radial-gradient(circle at 84% 14%, rgba(255,255,255,0.07) 0%, transparent 36%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "min(1120px, 100%)",
          margin: "0 auto",
          padding: "108px 20px 72px",
          boxSizing: "border-box",
          display: "grid",
          gap: "26px",
        }}
      >
        <header style={{ display: "grid", gap: "10px" }}>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: COPPER,
              fontWeight: 700,
            }}
          >
            Reserve and Collect
          </p>
          <h1
            style={{
              margin: 0,
              color: "#e7dfd8",
              fontSize: "clamp(28px, 4vw, 44px)",
              letterSpacing: "0.01em",
            }}
          >
            My Library{userName ? `, ${userName}` : ""}
          </h1>
          <p
            style={{
              margin: 0,
              color: SILVER_MUTED,
              maxWidth: "760px",
              lineHeight: 1.65,
            }}
          >
            Your active reservations are listed as digital handover tickets.
            Present the collection code at The Reader's Nook desk to collect
            your physical copy.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "12px",
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                border: "1px solid rgba(196,134,95,0.25)",
                borderRadius: "14px",
                background: "rgba(16,12,9,0.66)",
                padding: "16px 18px",
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                style={{
                  margin: "0 0 6px 0",
                  color: SILVER_MUTED,
                  fontSize: "12px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#f4e9de",
                  fontSize: "26px",
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {loading ? (
          <p style={{ color: SILVER_MUTED }}>Loading your library tickets...</p>
        ) : loadError ? (
          <section
            style={{
              border: "1px solid rgba(255,155,134,0.35)",
              borderRadius: "18px",
              background: "rgba(38,18,14,0.6)",
              padding: "24px",
              color: "#ffb4a1",
            }}
          >
            <p style={{ margin: 0, lineHeight: 1.6 }}>{loadError}</p>
          </section>
        ) : activeReservations.length === 0 ? (
          <section
            style={{
              border: "1px solid rgba(196,134,95,0.2)",
              borderRadius: "18px",
              background: "rgba(16,12,9,0.64)",
              padding: "34px 26px",
              textAlign: "center",
              display: "grid",
              gap: "14px",
            }}
          >
            <p style={{ margin: 0, color: SILVER_MUTED }}>
              You have no active reservations right now.
            </p>
            <button
              type="button"
              onClick={() => navigate("/books")}
              style={{
                justifySelf: "center",
                border: "none",
                borderRadius: "999px",
                background:
                  "linear-gradient(100deg, #8f5637 0%, #c4865f 48%, #9b613f 100%)",
                color: "#f9f2ea",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontSize: "12px",
                padding: "12px 24px",
                cursor: "pointer",
              }}
            >
              Browse Books
            </button>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {activeReservations.map((rental) => {
              const statusStyle =
                statusStyles[rental.status] ?? statusStyles.PICKED_UP;

              return (
                <article
                  key={rental.id}
                  style={{
                    position: "relative",
                    borderRadius: "18px",
                    border: "1px solid rgba(196,134,95,0.3)",
                    overflow: "hidden",
                    background:
                      "linear-gradient(145deg, rgba(24,18,14,0.96) 0%, rgba(12,9,7,0.96) 55%, rgba(22,16,12,0.96) 100%)",
                    boxShadow: "0 20px 35px rgba(0,0,0,0.35)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 7px)",
                      opacity: 0.26,
                    }}
                  />

                  <div
                    style={{
                      height: "5px",
                      background:
                        "linear-gradient(90deg, rgba(196,134,95,0.2) 0%, rgba(196,134,95,0.95) 50%, rgba(196,134,95,0.2) 100%)",
                    }}
                  />

                  <div
                    style={{
                      position: "relative",
                      padding: "18px 18px 16px",
                      display: "grid",
                      gap: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        gap: "12px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            color: "#f3e5d8",
                            fontSize: "18px",
                            fontWeight: 700,
                            lineHeight: 1.24,
                          }}
                        >
                          {rental.bookTitle}
                        </p>
                        <p
                          style={{
                            margin: "4px 0 0 0",
                            color: SILVER_MUTED,
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          by {rental.bookAuthor}
                        </p>
                      </div>

                      <span
                        style={{
                          whiteSpace: "nowrap",
                          borderRadius: "999px",
                          border: `1px solid ${statusStyle.border}`,
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontSize: "11px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          padding: "6px 10px",
                        }}
                      >
                        {rental.status}
                      </span>
                    </div>

                    <div
                      style={{
                        border: "1px dashed rgba(196,134,95,0.4)",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        display: "grid",
                        gap: "6px",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.16em",
                          color: "rgba(192,192,192,0.62)",
                        }}
                      >
                        Collection Code
                      </p>
                      <p
                        style={{
                          margin: 0,
                          color: "#f6ccaa",
                          fontSize: "28px",
                          letterSpacing: "0.1em",
                          fontWeight: 800,
                          fontFamily: '"Courier New", monospace',
                        }}
                      >
                        {rental.collectionCode || "RN-0000"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "10px",
                        fontSize: "12px",
                      }}
                    >
                      <div
                        style={{
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(192,192,192,0.1)",
                          padding: "10px 11px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            color: "rgba(192,192,192,0.6)",
                          }}
                        >
                          Pickup Deadline
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#efe4d8",
                            lineHeight: 1.45,
                          }}
                        >
                          {formatDateTime(rental.pickupDeadline)}
                        </p>
                      </div>

                      <div
                        style={{
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(192,192,192,0.1)",
                          padding: "10px 11px",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 6px 0",
                            color: "rgba(192,192,192,0.6)",
                          }}
                        >
                          Return Target
                        </p>
                        <p
                          style={{
                            margin: 0,
                            color: "#efe4d8",
                            lineHeight: 1.45,
                          }}
                        >
                          {formatDate(rental.returnDate)}
                        </p>
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: "rgba(192,192,192,0.54)",
                        fontSize: "12px",
                      }}
                    >
                      Ticket #{rental.id} • Reserved on{" "}
                      {formatDate(rental.rentalDate)}
                    </p>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default MyLibraryPage;
