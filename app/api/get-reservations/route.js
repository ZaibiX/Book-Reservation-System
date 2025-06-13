import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import db from "../../../utils/db";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = session.user.id;

  try {
    const reservationsResult = await db.query(
      `SELECT 
         Reservation.id,
         Book.name AS "bookName",
         Book.isbn,
         Reservation.due_date AS "dueDate",
         Reservation_Status.title AS "status"
       FROM Reservation
       JOIN BookCopy ON Reservation.book_copy_id = BookCopy.id
       JOIN Book ON BookCopy.book_id = Book.id
       JOIN Reservation_Status ON Reservation.status_id = Reservation_Status.id
       WHERE Reservation.student_id = $1
       ORDER BY Reservation.due_date DESC`,
      [studentId]
    );

    return NextResponse.json({ reservations: reservationsResult.rows });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reservations", details: err.message },
      { status: 500 }
    );
  }
}