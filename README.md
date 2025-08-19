
## 📚 Library Management System

  

A full-stack Database Management System (DBMS) built with Next.js, Supabase (PostgreSQL), and NextAuth.js for authentication.

  

This project was developed as a Course Project and supports:

  

👩‍🎓 Student login

📚 Librarian login

🔐 Authentication & session management with NextAuth

📖 Book, Authors, Genres, Reservations & Copies management

  

### 🚀 Getting Started

  

#### 1️⃣ Clone the repository

git clone: `https://github.com/zaibix/book-reservation-system.git`

`cd book-reservation-system`

  

#### 2️⃣ Install dependencies

`npm install`

#### 3️⃣ Setup environment variables

Create a .env.local file in the root of the project:

  

`SUPABASE_DB=postgresql://<user>:<password>@<host>:<port>/<database>`

`NEXTAUTH_URL=http://localhost:3000`

`NEXTAUTH_SECRET=your-random-secret`

  
- SUPABASE_DB → Your Supabase connection string (Transaction Pooler recommended).

  

- NEXTAUTH_URL → Local development: http://localhost:3000

  

  - Production: your deployed domain

  

- NEXTAUTH_SECRET → Generate a random string:

  

     `openssl rand -base64 32`

  

#### 4️⃣ Run the project

`npm run dev`

  

Visit 👉 http://localhost:3000

  

### ⚙️ Tech Stack

Frontend → Next.js (App Router)
Database → PostgreSQL (Supabase)
Auth → NextAuth.js (Credentials + Role-based)
ORM/Queries → Raw SQL using pg

  

### 📂 Features

  

✅ Student login & dashboard
✅ Librarian login & dashboard
✅ Manage books, authors, genres
✅ Track reservations & availability
✅ Fine calculation after due date

#### 📌 Notes

Works with both local development and production deployment.
Ensure that Supabase database access is configured properly.
Only the server (with service role key) should interact with the database directly.

### 🛠️ Development Commands

` npm run dev` # Start development server

`npm run build ` # Build for production

`npm start` # Run production build

  
  

### 🗄️ Database Schema Overview  

#### Main entities include:

- Book (id, name, isbn, genre_id)
- Genre (id, title)
- Author (id, name)
- BookAuthor (book_id, author_id) – junction table
- BookCopy (id, book_id, is_reserved)
- Reservation (id, student_id, book_copy_id, due_date, status)
- Student (id, name, email, …)
- Librarian (id, name, email, …)

The full SQL schema is available in [`utils/schema.sql`](./utils/schema.sql).

DBMS Project – Built by ZaibiX 🎓