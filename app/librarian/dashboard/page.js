'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function LibrarianDashboard() {
  const [stats, setStats] = useState({})
  const [recentReservations, setRecentReservations] = useState([])
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // Mock data
    setStats({
      totalBooks: 156,
      totalStudents: 89,
      activeReservations: 23,
      overdue: 5,
      pendingRequests: 8
    })

    setRecentReservations([
      { id: 1, studentName: 'John Doe', bookName: 'Clean Code', requestDate: '2024-05-20', status: 'pending' },
      { id: 2, studentName: 'Jane Smith', bookName: 'Effective Java', requestDate: '2024-05-19', status: 'approved' },
      { id: 3, studentName: 'Mike Johnson', bookName: 'Algorithms', requestDate: '2024-05-18', status: 'pending' }
    ])

    setNotifications([
      { id: 1, message: 'New reservation request from John Doe', type: 'request', time: '10 minutes ago' },
      { id: 2, message: '5 books are overdue', type: 'warning', time: '1 hour ago' },
      { id: 3, message: 'System backup completed', type: 'info', time: '2 hours ago' }
    ])
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
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
    padding: '20px'
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  }

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  }

  const statCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }

  const buttonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    margin: '5px'
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      window.location.href = '/'
    }
  }

  const handleApproveReservation = (id) => {
    setRecentReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'approved' }
          : reservation
      )
    )
    alert('Reservation approved!')
  }

  const handleRejectReservation = (id) => {
    setRecentReservations(prev => 
      prev.map(reservation => 
        reservation.id === id 
          ? { ...reservation, status: 'rejected' }
          : reservation
      )
    )
    alert('Reservation rejected!')
  }

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={{ margin: 0, color: '#333' }}>👨‍💼 Librarian Dashboard</h1>
            <p style={{ margin: '5px 0 0', color: '#666' }}>Welcome back, Admin</p>
          </div>
          <div>
            <Link href="/librarian/books" style={buttonStyle}>
              Manage Books
            </Link>
            <Link href="/librarian/reservations" style={buttonStyle}>
              Reservations
            </Link>
            <button onClick={handleLogout} style={{ ...buttonStyle, backgroundColor: '#6c757d' }}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div style={mainContentStyle}>
        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px', color: '#667eea', fontSize: '2rem' }}>{stats.totalBooks}</h3>
            <p style={{ margin: 0, color: '#666' }}>Total Books</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px', color: '#28a745', fontSize: '2rem' }}>{stats.totalStudents}</h3>
            <p style={{ margin: 0, color: '#666' }}>Registered Students</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px', color: '#ffc107', fontSize: '2rem' }}>{stats.activeReservations}</h3>
            <p style={{ margin: 0, color: '#666' }}>Active Reservations</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px', color: '#dc3545', fontSize: '2rem' }}>{stats.overdue}</h3>
            <p style={{ margin: 0, color: '#666' }}>Overdue Books</p>
          </div>
          <div style={statCardStyle}>
            <h3 style={{ margin: '0 0 10px', color: '#17a2b8', fontSize: '2rem' }}>{stats.pendingRequests}</h3>
            <p style={{ margin: 0, color: '#666' }}>Pending Requests</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Recent Reservations */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333' }}>📋 Recent Reservation Requests</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {recentReservations.map(reservation => (
                <div key={reservation.id} style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '6px', 
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px', color: '#333' }}>{reservation.bookName}</h4>
                    <p style={{ margin: '0 0 5px', color: '#666' }}>Student: {reservation.studentName}</p>
                    <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Requested: {reservation.requestDate}</p>
                  </div>
                  <div>
                    <span style={{
                      backgroundColor: reservation.status === 'pending' ? '#ffc107' : 
                                     reservation.status === 'approved' ? '#28a745' : '#dc3545',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginRight: '10px'
                    }}>
                      {reservation.status}
                    </span>
                    {reservation.status === 'pending' && (
                      <div style={{ marginTop: '10px' }}>
                        <button
                          onClick={() => handleApproveReservation(reservation.id)}
                          style={{ ...buttonStyle, backgroundColor: '#28a745', fontSize: '12px', margin: '2px' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectReservation(reservation.id)}
                          style={{ ...buttonStyle, fontSize: '12px', margin: '2px' }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div style={cardStyle}>
            <h2 style={{ marginTop: 0, color: '#333' }}>🔔 Notifications</h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {notifications.map(notification => (
                <div key={notification.id} style={{ 
                  borderLeft: `4px solid ${notification.type === 'request' ? '#667eea' : 
                                         notification.type === 'warning' ? '#ffc107' : '#17a2b8'}`,
                  padding: '10px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#333' }}>
                    {notification.message}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                    {notification.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
