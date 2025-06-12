import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import db from "../../../utils/db";

// GET (Read) - Already implemented
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.query(`
    SELECT 
    Book.id,
    Book.isbn,
    Book.name,
    (
        SELECT string_agg(Author.name, ', ')
        FROM BookAuthor
        INNER JOIN Author ON BookAuthor.author_id = Author.id
        WHERE BookAuthor.book_id = Book.id
    ) AS authors,
    Genre.title as genre,
    BOOL_AND(BookCopy.is_reserved) as is_reserved,  -- This will be true only if ALL copies are reserved
    COUNT(BookCopy.book_id) as quantity
FROM Book
INNER JOIN Genre ON Genre.id = Book.genre_id
INNER JOIN BookCopy ON Book.id = BookCopy.book_id
GROUP BY Book.id, Book.isbn, Book.name, Genre.title
ORDER BY Book.id;

    `);

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

// POST (Create)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { isbn, name, authors, genre, quantity } = await req.json();

    // Start a transaction
    await db.query("BEGIN");

    // 1. Insert into Book table
    const bookResult = await db.query(
      `INSERT INTO Book (isbn, name, genre_id)
       VALUES ($1, $2, (SELECT id FROM Genre WHERE title = $3))
       RETURNING id`,
      [isbn, name, genre]
    );
    const bookId = bookResult.rows[0].id;

    // 2. Insert authors
    const authorsList = authors.split(",").map((author) => author.trim());
    for (const authorName of authorsList) {
      // Insert or get author
      const authorResult = await db.query(
        `INSERT INTO Author (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [authorName]
      );
      const authorId = authorResult.rows[0].id;

      // Link author to book
      await db.query(
        `INSERT INTO BookAuthor (book_id, author_id)
         VALUES ($1, $2)`,
        [bookId, authorId]
      );
    }

    // 3. Insert book copies
    for (let i = 0; i < quantity; i++) {
      await db.query(
        `INSERT INTO BookCopy (book_id, is_reserved)
         VALUES ($1, false)`,
        [bookId]
      );
    }

    await db.query("COMMIT");

    return NextResponse.json({ message: "Book added successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

// PUT (Update)
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isbn, name, authors, genre, quantity } = await req.json();

    await db.query("BEGIN");

    // 1. Update Book
    await db.query(
      `UPDATE Book 
       SET isbn = $1, name = $2, genre_id = (SELECT id FROM Genre WHERE title = $3)
       WHERE id = $4`,
      [isbn, name, genre, id]
    );

    // 2. Update authors
    // First, remove all existing author associations
    await db.query(`DELETE FROM BookAuthor WHERE book_id = $1`, [id]);

    // Then add new authors
    const authorsList = authors.split(",").map((author) => author.trim());
    for (const authorName of authorsList) {
      const authorResult = await db.query(
        `INSERT INTO Author (name)
         VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [authorName]
      );
      const authorId = authorResult.rows[0].id;

      await db.query(
        `INSERT INTO BookCopy (book_id, is_reserved)
         VALUES ($1, $2)`,
        [id, authorId]
      );
    }

    // 3. Update quantity
    const currentCopies = await db.query(
      `SELECT COUNT(*) as count FROM BookCopy WHERE book_id = $1`,
      [id]
    );
    const currentCount = parseInt(currentCopies.rows[0].count);

    if (quantity > currentCount) {
      // Add more copies
      for (let i = 0; i < quantity - currentCount; i++) {
        await db.query(
          `INSERT INTO BookCopy (book_id, is_reserved)
           VALUES ($1, false)`,
          [id]
        );
      }
    } else if (quantity < currentCount) {
      // Remove excess copies
      await db.query(
        `DELETE FROM BookCopy 
         WHERE book_id = $1 
         AND is_reserved = false 
         AND id IN (
           SELECT id FROM BookCopy 
           WHERE book_id = $1 
           AND is_reserved = false 
           LIMIT $2
         )`,
        [id, currentCount - quantity]
      );
    }

    await db.query("COMMIT");

    return NextResponse.json({ message: "Book updated successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await db.query("BEGIN");

    // Delete in this order to maintain referential integrity
    await db.query("DELETE FROM BookCopy WHERE book_id = $1", [id]);
    await db.query("DELETE FROM BookAuthor WHERE book_id = $1", [id]);
    await db.query("DELETE FROM Book WHERE id = $1", [id]);

    await db.query("COMMIT");

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
