export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Online Book Reservation System</title>
        <meta name="description" content="University Library Management System" />
      </head>
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  )
}
