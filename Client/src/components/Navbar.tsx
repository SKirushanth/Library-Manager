import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { token, role, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinkStyle = {
    color: '#CAE4DB',
    textDecoration: 'none',
    fontSize: '15px',
    letterSpacing: '0.5px',
    fontFamily: "'Georgia', serif",
    padding: '6px 0',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  }

  return (
    <nav style={{
      width: '100%',
      background: '#1a3a5c',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>

      {/* ── LEFT: Brand ── */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
        }}
      >
        {/* Book icon */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#DCAE1D">
          <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z"/>
        </svg>
        <span style={{
          color: '#DCAE1D',
          fontFamily: "'Georgia', serif",
          fontSize: '20px',
          fontWeight: '700',
          letterSpacing: '0.5px',
        }}>
          The Reader's Nook
        </span>
      </Link>

      {/* ── CENTER: Nav Links (desktop) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
      }}
        className="desktop-nav"
      >
        <Link
          to="/books"
          style={navLinkStyle}
          onMouseEnter={(e) => e.currentTarget.style.color = '#DCAE1D'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#CAE4DB'}
        >
          Books
        </Link>

        {token && (
          <Link
            to="/dashboard"
            style={navLinkStyle}
            onMouseEnter={(e) => e.currentTarget.style.color = '#DCAE1D'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#CAE4DB'}
          >
            Dashboard
          </Link>
        )}

        {token && role === 'ADMIN' && (
          <Link
            to="/admin"
            style={navLinkStyle}
            onMouseEnter={(e) => e.currentTarget.style.color = '#DCAE1D'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#CAE4DB'}
          >
            Admin
          </Link>
        )}
      </div>

      {/* ── RIGHT: Auth buttons ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {token ? (
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              color: '#CAE4DB',
              border: '1px solid #7A9D96',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: "'Georgia', serif",
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#DCAE1D'
              e.currentTarget.style.color = '#1a1a1a'
              e.currentTarget.style.borderColor = '#DCAE1D'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#CAE4DB'
              e.currentTarget.style.borderColor = '#7A9D96'
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: '#CAE4DB',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: "'Georgia', serif",
                padding: '8px 16px',
                borderRadius: '5px',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#DCAE1D'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CAE4DB'}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: '#1a1a1a',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: "'Georgia', serif",
                padding: '8px 20px',
                borderRadius: '5px',
                background: '#DCAE1D',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#c49b18'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#DCAE1D'}
            >
              Register
            </Link>
          </>
        )}

        {/* ── Hamburger (mobile) ── */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
          }}
          id="hamburger"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#CAE4DB">
            {menuOpen
              ? <path d="M18 6L6 18M6 6l12 12" stroke="#CAE4DB" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M3 6h18M3 12h18M3 18h18" stroke="#CAE4DB" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
          background: '#1a3a5c',
          borderTop: '1px solid #7A9D96',
          padding: '20px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99,
        }}>
          <Link to="/books" style={{ color: '#CAE4DB', fontFamily: "'Georgia', serif" }} onClick={() => setMenuOpen(false)}>Books</Link>
          {token && <Link to="/dashboard" style={{ color: '#CAE4DB', fontFamily: "'Georgia', serif" }} onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {token && role === 'ADMIN' && <Link to="/admin" style={{ color: '#CAE4DB', fontFamily: "'Georgia', serif" }} onClick={() => setMenuOpen(false)}>Admin</Link>}
          {token
            ? <button onClick={handleLogout} style={{ color: '#CAE4DB', background: 'none', border: '1px solid #7A9D96', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontFamily: "'Georgia', serif", textAlign: 'left' }}>Logout</button>
            : <>
                <Link to="/login" style={{ color: '#CAE4DB', fontFamily: "'Georgia', serif" }} onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" style={{ color: '#1a1a1a', background: '#DCAE1D', padding: '8px 16px', borderRadius: '5px', fontFamily: "'Georgia', serif", display: 'inline-block', width: 'fit-content' }} onClick={() => setMenuOpen(false)}>Register</Link>
              </>
          }
        </div>
      )}
    </nav>
  )
}

export default Navbar