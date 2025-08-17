import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import db from "../../../utils/db";

export async function GET() {
  try {
    const booksResult = await db.query(
      `SELECT 
  Book.id,
  Book.name,
  Book.isbn,
  Genre.title AS genre,
  array_agg(DISTINCT Author.name) AS authors,
  COUNT(DISTINCT BookCopy.id) FILTER (WHERE BookCopy.is_reserved = false) AS quantity
FROM Book
 JOIN Genre ON Book.genre_id = Genre.id
LEFT JOIN BookAuthor ON BookAuthor.book_id = Book.id
LEFT JOIN Author ON Author.id = BookAuthor.author_id
LEFT JOIN BookCopy ON BookCopy.book_id = Book.id
GROUP BY Book.id, Genre.title
ORDER BY Book.id;
`
    );

    return NextResponse.json({ books: booksResult.rows });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch books", details: err.message },
      { status: 500 }
    );
  }
}