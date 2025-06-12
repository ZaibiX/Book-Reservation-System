import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import db from "../../../utils/db";
export async function GET(req) {
  console.log("code is: ", await hash("admin123", 10));
  const result = db.query("Select id from Genre where title = $1", ["Abc"]);
  console.log("hello ", result.rows);
  return NextResponse.json(
    { error: "User already exists with this email" },
    { status: 409 }
  );
}
