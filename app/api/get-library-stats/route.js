import { NextResponse } from "next/server";
import db from "@/utils/db.js"; // adjust this path to your db connection

export async function GET() {
  try {
    // 1. Total books
    const totalBooks = await db.query(`SELECT COUNT(*) AS total FROM book`);

    // 2. Total registered students
    const totalStudents = await db.query(`SELECT COUNT(*) AS total FROM student`);

    // 3. Active reservations
    const activeReservations = await db.query(
      `SELECT COUNT(*) AS total FROM reservation WHERE status_id = 1` // active = 1
    );

    // 4. Overdue books
    const overdue = await db.query(
      `SELECT COUNT(*) AS total FROM reservation WHERE status_id = 4` // overdue = 4
    );

    // 5. Pending requests
    const pendingRequests = await db.query(
      `SELECT COUNT(*) AS total FROM reservation WHERE status_id = 6` // pending = 6
    );

    // 6. Recent reservations (limit 10)
    const recentReservations = await db.query(`
      SELECT 
        r.id,
        s.id AS "studentId",
        CONCAT(n.fname, ' ', n.lname) AS "studentName",
        s.email AS "studentEmail",
        b.id AS "bookId",
        b.name AS "bookName",
        b.isbn,
        r.created_at AS "createdAt",
        r.due_date AS "dueDate",
        rs.title AS "status"
      FROM reservation r
      JOIN student s ON r.student_id = s.id
      JOIN name n ON s.name_id = n.id
      JOIN bookcopy bc ON r.book_copy_id = bc.id
      JOIN book b ON bc.book_id = b.id
      JOIN reservation_status rs ON r.status_id = rs.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    return NextResponse.json({
      totalBooks: totalBooks.rows[0].total,
      totalStudents: totalStudents.rows[0].total,
      activeReservations: activeReservations.rows[0].total,
      overdueBooks: overdue.rows[0].total,
      pendingRequests: pendingRequests.rows[0].total,
      recentReservations: recentReservations.rows,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
