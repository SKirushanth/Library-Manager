import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroImg from '../assets/hero.avif'

interface Book {
  id: number
  title: string
  author: string
  description: string
  copiesAvailable: number
  pages: number
  rating: number
  badge?: 'BESTSELLER' | "EDITOR'S PICK" | 'NEW ARRIVAL' | null
  coverColor: string
  spineColor: string
}

const fakeBooks: Book[] = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', description: 'A dazzling portrait of wealth, obsession, and the American Dream in the Jazz Age.', copiesAvailable: 3, pages: 180, rating: 4.7, badge: 'BESTSELLER', coverColor: '#DCAE1D', spineColor: '#1a3a5c' },
  { id: 2, title: '1984', author: 'George Orwell', description: 'A chilling portrait of a totalitarian world where truth is whatever the Party says.', copiesAvailable: 2, pages: 328, rating: 4.9, badge: "EDITOR'S PICK", coverColor: '#CAE4DB', spineColor: '#2d1a5c' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', description: 'A story of racial injustice and childhood innocence in the American South.', copiesAvailable: 0, pages: 281, rating: 4.8, badge: null, coverColor: '#F5C4B3', spineColor: '#4a1b0c' },
  { id: 4, title: 'The Hobbit', author: 'J.R.R. Tolkien', description: 'A hobbit embarks on an unexpected journey through a world of dragons and dwarves.', copiesAvailable: 5, pages: 310, rating: 4.8, badge: 'BESTSELLER', coverColor: '#C0DD97', spineColor: '#173404' },
  { id: 5, title: 'Harry Potter', author: 'J.K. Rowling', description: 'A young wizard discovers his destiny at the most magical school in the world.', copiesAvailable: 4, pages: 223, rating: 4.9, badge: 'NEW ARRIVAL', coverColor: '#CECBF6', spineColor: '#26215C' },
  { id: 6, title: 'Clean Code', author: 'Robert C. Martin', description: 'A handbook of agile craftsmanship — write code that humans can actually read.', copiesAvailable: 1, pages: 431, rating: 4.6, badge: "EDITOR'S PICK", coverColor: '#B5D4F4', spineColor: '#042C53' },
]

const badgeColors: Record<string, { bg: string; color: string }> = {
  'BESTSELLER':    { bg: '#DCAE1D', color: '#5a3a00' },
  "EDITOR'S PICK": { bg: '#CAE4DB', color: '#0F6E56' },
  'NEW ARRIVAL':   { bg: '#CECBF6', color: '#26215C' },
}

function BookCard({ book, onClick }: { book: Book; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const available = book.copiesAvailable > 0

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '0.5px solid #ddd',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover area */}
      <div style={{
        background: `linear-gradient(135deg, ${book.spineColor} 0%, ${book.spineColor}cc 100%)`,
        height: '170px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* 3D Book */}
        <div style={{
          width: '85px',
          height: '115px',
          background: book.coverColor,
          borderRadius: '3px 10px 10px 3px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '-5px 5px 15px rgba(0,0,0,0.45)',
          position: 'relative',
        }}>
          {/* Spine shadow */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '3px 0 0 3px',
          }} />
          <svg width="30" height="30" viewBox="0 0 24 24" fill={book.spineColor} opacity={0.7}>
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z"/>
          </svg>
        </div>

        {/* Badge */}
        {book.badge && (
          <span style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: badgeColors[book.badge].bg,
            color: badgeColors[book.badge].color,
            fontSize: '9px',
            fontWeight: '700',
            padding: '3px 8px',
            borderRadius: '20px',
            letterSpacing: '0.8px',
            fontFamily: 'Georgia, serif',
          }}>
            {book.badge}
          </span>
        )}

        {/* Not available overlay */}
        {!available && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'Georgia, serif',
              letterSpacing: '1px',
              border: '1px solid #fff',
              padding: '4px 12px',
              borderRadius: '20px',
            }}>
              UNAVAILABLE
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 2px', fontFamily: 'Georgia, serif' }}>
          {book.title}
        </p>
        <p style={{ fontSize: '12px', color: '#888', margin: '0 0 10px', fontFamily: 'Georgia, serif' }}>
          by {book.author}
        </p>
        <p style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', margin: '0 0 14px', flex: 1, fontFamily: 'Georgia, serif' }}>
          "{book.description}"
        </p>

        {/* Stats row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          borderTop: '0.5px solid #eee',
          borderBottom: '0.5px solid #eee',
          padding: '10px 0',
          marginBottom: '14px',
        }}>
          {[
            { val: `${book.rating}⭐`, label: 'Rating' },
            { val: `${book.pages}`, label: 'Pages' },
            { val: `${book.copiesAvailable}`, label: 'Copies' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1a3a5c', fontFamily: 'Georgia, serif' }}>
                {stat.val}
              </span>
              <span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Georgia, serif' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={onClick}
          disabled={!available}
          style={{
            width: '100%',
            padding: '10px',
            background: available ? '#1a3a5c' : '#ccc',
            color: available ? '#DCAE1D' : '#888',
            border: 'none',
            borderRadius: '30px',
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            fontWeight: '600',
            cursor: available ? 'pointer' : 'not-allowed',
            letterSpacing: '0.5px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => { if (available) e.currentTarget.style.background = '#DCAE1D'; if (available) e.currentTarget.style.color = '#1a1a1a' }}
          onMouseLeave={(e) => { if (available) e.currentTarget.style.background = '#1a3a5c'; if (available) e.currentTarget.style.color = '#DCAE1D' }}
        >
          {available ? 'Rent this Book' : 'Not Available'}
        </button>
      </div>
    </div>
  )
}

function BooksPage() {
  const [books] = useState<Book[]>(fakeBooks)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  )

  const handleBrowse = () => {
    document.getElementById('books-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', height: '92vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img src={heroImg} alt="hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.82) 45%, rgba(0,0,0,0.1) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '0 60px', maxWidth: '600px' }}>
          <p style={{ color: '#DCAE1D', fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '16px' }}>The Reader's Nook</p>
          <h1 style={{ color: '#DCAE1D', fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: '700', lineHeight: '1.15', marginBottom: '20px' }}>
            Discover Your Next<br />Great Story
          </h1>
          <p style={{ color: '#CAE4DB', fontSize: '18px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '440px' }}>
            Dive into a world of imagination and knowledge. Every page holds a new adventure waiting for you.
          </p>
          <button
            onClick={handleBrowse}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 32px', background: '#1a3a5c', color: '#CAE4DB', border: '2px solid #7A9D96', borderRadius: '6px', fontSize: '16px', fontFamily: 'Georgia, serif', cursor: 'pointer', letterSpacing: '1px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#DCAE1D'; e.currentTarget.style.color = '#1a1a1a'; e.currentTarget.style.borderColor = '#DCAE1D' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#1a3a5c'; e.currentTarget.style.color = '#CAE4DB'; e.currentTarget.style.borderColor = '#7A9D96' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 1.5L18.5 9H13V3.5zM6 4h5v7h7v9H6V4z"/>
            </svg>
            Browse Books
          </button>
        </div>
      </div>

      {/* ── BOOKS SECTION ── */}
      <div id="books-section" style={{ background: 'linear-gradient(135deg, #7A9D96 0%, #CAE4DB 100%)', minHeight: '100vh', padding: '50px 40px' }}>
        <h2 style={{ color: '#1a1a1a', fontSize: '32px', marginBottom: '6px' }}>Our Collection</h2>
        <p style={{ color: '#3a3a3a', marginBottom: '25px', fontSize: '15px' }}>{books.length} books available</p>

        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '12px 18px', width: '320px', marginBottom: '30px', borderRadius: '30px', border: '1px solid #7A9D96', fontSize: '15px', background: 'rgba(255,255,255,0.85)', outline: 'none', fontFamily: 'Georgia, serif' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onClick={() => navigate(`/books/${book.id}`)} />
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <p style={{ color: '#444', marginTop: '20px', fontSize: '16px' }}>No books found matching "{search}"</p>
        )}
      </div>
    </div>
  )
}

export default BooksPage