import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import db from "../../../utils/db";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { bookId } = await req.json();
  const studentId = session.user.id;

  // Check if student already has an 'active', 'pending', or 'overdue' reservation
  const statusRes = await db.query(
    `SELECT id FROM Reservation_Status WHERE title IN ('active', 'pending', 'overdue')`
  );
  const statusIds = statusRes.rows.map(r => r.id);
  if (statusIds.length === 0) {
    return NextResponse.json({ error: "Status check failed." }, { status: 500 });
  }

  const alreadyReserved = await db.query(
    `SELECT 1 FROM Reservation
     WHERE student_id = $1 AND status_id = ANY($2::int[]) LIMIT 1`,
    [studentId, statusIds]
  );
  if (alreadyReserved.rows.length > 0) {
    return NextResponse.json(
      { error: "You already have an active, pending, or overdue reservation. Please complete or cancel it first." },
      { status: 400 }
    );
  }

  // Find an available copy
  const copyResult = await db.query(
    `SELECT id FROM BookCopy WHERE book_id = $1 AND is_reserved = false LIMIT 1`,
    [bookId]
  );
  if (copyResult.rows.length === 0) {
    return NextResponse.json({ error: "No available copies" }, { status: 400 });
  }
  const copyId = copyResult.rows[0].id;

  // Find status_id for "pending"
  const pendingStatus = await db.query(
    `SELECT id FROM Reservation_Status WHERE title = $1 LIMIT 1`,
    ['pending']
  );
  if (pendingStatus.rows.length === 0) {
    return NextResponse.json({ error: "No 'pending' status found" }, { status: 500 });
  }
  const statusId = pendingStatus.rows[0].id;

  try {
    await db.query("BEGIN");
    await db.query(
      `UPDATE BookCopy SET is_reserved = true WHERE id = $1`,
      [copyId]
    );
    await db.query(
      `INSERT INTO Reservation (student_id, book_copy_id, status_id, due_date)
        VALUES ($1, $2, $3, NOW() + interval '14 day')`,
      [studentId, copyId, statusId]
    );
    await db.query("COMMIT");

    return NextResponse.json({ message: "Reservation request submitted. It is now pending." });
  } catch (err) {
    await db.query("ROLLBACK");
    return NextResponse.json(
      { error: "Failed to reserve book", details: err.message },
      { status: 500 }
    );
  }
}