import type { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 6,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        overflow: "hidden",
        gap: "40px",
        padding: "64px 24px",
        marginTop: "40px",
        borderTop: "1px solid rgba(182,129,92,0.22)",
        background: "#0a0908",
        color: "rgba(192,192,192,0.72)",
        fontSize: "13px",
        fontFamily: 'Inter, Geist, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: "40px",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <svg
            width="31"
            height="34"
            viewBox="0 0 31 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8.75 5.3 6.75 3.884 6.75-3.885M8.75 28.58v-7.755L2 16.939m27 0-6.75 3.885v7.754M2.405 9.408 15.5 16.954l13.095-7.546M15.5 32V16.939M29 22.915V10.962a2.98 2.98 0 0 0-1.5-2.585L17 2.4a3.01 3.01 0 0 0-3 0L3.5 8.377A3 3 0 0 0 2 10.962v11.953A2.98 2.98 0 0 0 3.5 25.5L14 31.477a3.01 3.01 0 0 0 3 0L27.5 25.5a3 3 0 0 0 1.5-2.585"
              stroke="url(#brandGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="brandGrad"
                x1="15.5"
                y1="2"
                x2="15.5"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#f4dfcb" />
                <stop offset="1" stopColor="#c4865f" />
              </linearGradient>
            </defs>
          </svg>
          <span
            style={{
              color: "#e6e6e6",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            The Reader's Nook
          </span>
        </a>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "8px",
        }}
      >
        <p style={{ maxWidth: "260px", margin: 0, textAlign: "right" }}>
          Curating timeless stories and modern escapes for every kind of reader.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginTop: "10px",
          }}
        >
          <a
            href="https://dribbble.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
            aria-label="Dribbble"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
              <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
              <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect width="4" height="12" x="2" y="9"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "inherit" }}
            aria-label="YouTube"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
              <path d="m10 15 5-3-5-3z"></path>
            </svg>
          </a>
        </div>
        <p style={{ marginTop: "8px", textAlign: "right" }}>
          © {new Date().getFullYear()} The Reader's Nook
        </p>
      </div>
    </footer>
  );
}
