import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import db from "../../../utils/db";

// GET: fetch all reservations for librarian
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.query(`
      SELECT 
        Reservation.id,
        Student.id AS "studentId",
        CONCAT(name.fname, ' ', name.lname) AS "studentName",
        Student.email AS "studentEmail",
        Book.id AS "bookId",
        Book.name AS "bookName",
        Book.isbn,
        Reservation.created_at AS "createdAt",
        Reservation.due_date AS "dueDate",
        Reservation_Status.title AS "status"
      FROM Reservation
      JOIN Student ON Reservation.student_id = Student.id
      JOIN name ON Student.name_id = name.id
      JOIN BookCopy ON Reservation.book_copy_id = BookCopy.id
      JOIN Book ON BookCopy.book_id = Book.id
      JOIN Reservation_Status ON Reservation.status_id = Reservation_Status.id
      ORDER BY Reservation.created_at DESC
    `);

    return NextResponse.json({ reservations: result.rows });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch reservations", details: err.message }, { status: 500 });
  }
}

// POST: update reservation status (approve, reject, return)
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "librarian") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reservationId, action } = await req.json();

  // Map actions to statuses
  let newStatus = null;
  if (action === "approve") newStatus = "active";
  else if (action === "reject" || action === "cancel") newStatus = "cancelled";
  else if (action === "return") newStatus = "completed";
  else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  // Get the corresponding status_id
  const statusRes = await db.query(
    `SELECT id FROM Reservation_Status WHERE title = $1 LIMIT 1`,
    [newStatus]
  );
  if (statusRes.rows.length === 0) {
    return NextResponse.json({ error: "Status not found" }, { status: 500 });
  }
  const statusId = statusRes.rows[0].id;

  try {
    await db.query("BEGIN");
    // Update Reservation status
    await db.query(
      `UPDATE Reservation SET status_id = $1 WHERE id = $2`,
      [statusId, reservationId]
    );

    // If marking as completed (returned), free the book copy AND calculate fine
    if (action === "return"|| action === "reject") {
      // Get book_copy_id and due_date
      const copyRes = await db.query(
        `SELECT book_copy_id, due_date FROM Reservation WHERE id = $1`,
        [reservationId]
      );
      if (copyRes.rows.length > 0) {
        // Free the book copy
        await db.query(
          `UPDATE BookCopy SET is_reserved = false WHERE id = $1`,
          [copyRes.rows[0].book_copy_id]
        );

        // Fine calculation
        const dueDate = copyRes.rows[0].due_date;
        let fine = 0;
        if (dueDate) {
          const due = new Date(dueDate);
          const today = new Date();
          if (today > due) {
            const diffTime = today - due;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.ceil(diffDays / 7);
            fine = weeks > 0 ? weeks * 10 : 0;
          }
        }
        // Insert or update Fine record
        await db.query(
          `
            INSERT INTO Fine (reservation_id, amount, updated_at)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (reservation_id)
            DO UPDATE SET amount = EXCLUDED.amount, updated_at = CURRENT_TIMESTAMP
          `,
          [reservationId, fine]
        );
      }
    }

    await db.query("COMMIT");
    return NextResponse.json({ message: "Reservation updated successfully." });
  } catch (err) {
    await db.query("ROLLBACK");
    return NextResponse.json({ error: "Failed to update reservation", details: err.message }, { status: 500 });
  }
}