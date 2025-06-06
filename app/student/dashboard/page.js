'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StudentDashboard() {
  const [books, setBooks] = useState([])
  const [reservations, setReservations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')

  // Mock data
  useEffect(() => {
    setBooks([
      { id: 1, isbn: '978-0134685991', name: 'Effective Java', authors: ['Joshua Bloch'], genre: 'Programming', quantity: 3, reserved: false },
      { id: 2, isbn: '978-0596009205', name: 'Head First Design Patterns', authors: ['Eric Freeman'], genre: 'Programming', quantity: 2, reserved: false },
      { id: 3, isbn: '978-0321573513', name: 'Algorithms', authors: ['Robert Sedgewick'], genre: 'Computer Science', quantity: 1, reserved: true },
      { id: 4, isbn: '978-0262033848', name: 'Introduction to Algorithms', authors: ['Thomas H. Cormen'], genre: 'Computer Science', quantity: 4, reserved: false }
    ])
    
    setReservations([
      { id: 1, bookName: 'Clean Code', isbn: '978-0132350884', reservedAt: '2024-05-15', dueDate: '2024-05-29', status: 'active', fine: 0 }
    ])
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    // backgroundColor: 'yellow'
  }

  const headerStyle = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
    padding: '20px 0'
  }

  const headerContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }

  const mainContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '20px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '30px',
  @media (min-width: 768px): {
    gridTemplateColumns: '2fr 1fr',
  },
};

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }

  const inputStyle = {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginBottom: '20px',
    width: '100%',
    boxSizing: 'border-box'
  }

  const buttonStyle = {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const handleReserveBook = (book) => {
    if (book.reserved || book.quantity === 0) {
      alert('This book is currently unavailable.')
      return
    }
    alert(`Reservation request sent for "${book.name}"`)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/'
    }
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}>📚 Student Dashboard</h1>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Welcome back, John Doe</p>
          </div>
          <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#dc3545' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={mainContentStyle}>
        <div>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333' }}>📖 Browse Books</h2>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, width: 'auto' }}
              >
                <option value="All">All Genres</option>
                <option value="Programming">Programming</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div style={{ display: 'grid', gap: '15px' }}>
              {filteredBooks.map(book => (
                <div key={book.id} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 5px', color: '#333' }}>{book.name}</h3>
                      <p style={{ margin: '0 0 5px', color: '#666' }}>by {book.authors.join(', ')}</p>
                      <p style={{ margin: '0 0 10px', color: '#888', fontSize: '14px' }}>ISBN: {book.isbn}</p>
                      <span style={{ 
                        backgroundColor: book.quantity > 0 ? '#28a745' : '#6c757d',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginRight: '10px'
                      }}>
                        {book.genre}
                      </span>
                      <span style={{ color: '#666', fontSize: '14px' }}>
                        Available: {book.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReserveBook(book)}
                      disabled={book.reserved || book.quantity === 0}
                      style={{
                        ...buttonStyle,
                        backgroundColor: book.reserved || book.quantity === 0 ? '#6c757d' : '#667eea'
                      }}
                    >
                      {book.reserved ? 'Reserved' : 'Reserve'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333' }}>📋 My Reservations</h2>
            {reservations.length > 0 ? (
              <div style={{ display: 'grid', gap: '15px' }}>
                {reservations.map(reservation => (
                  <div key={reservation.id} style={{ border: '1px solid #e0e0e0', borderRadius: '6px', padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px', color: '#333' }}>{reservation.bookName}</h4>
                    <p style={{ margin: '0 0 5px', color: '#666', fontSize: '14px' }}>ISBN: {reservation.isbn}</p>
                    <p style={{ margin: '0 0 5px', color: '#666', fontSize: '14px' }}>Due: {reservation.dueDate}</p>
                    <span style={{
                      backgroundColor: reservation.status === 'active' ? '#28a745' : '#dc3545',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {reservation.status}
                    </span>
                    {reservation.fine > 0 && (
                      <p style={{ margin: '10px 0 0', color: '#dc3545', fontSize: '14px' }}>
                        ⚠️ Fine: ${reservation.fine}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                No active reservations
              </p>
            )}
          </div>

          <div style={{ ...cardStyle, marginTop: '20px' }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>📊 Quick Stats</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Total Books</span>
                <span style={{ fontWeight: 'bold' }}>{books.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>Available</span>
                <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                  {books.filter(b => !b.reserved && b.quantity > 0).length}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>My Reservations</span>
                <span style={{ fontWeight: 'bold', color: '#667eea' }}>{reservations.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
