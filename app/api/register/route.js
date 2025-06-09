import db from "@/utils/db.js";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 10;

export async function POST(req) {
  
  try {
    const data = await req.json();
    // console.log(data)
    const { email, password, fName,lName } = data.formData;

    // 1. Check if user already exists
    const existingUser = await db.query(
      "SELECT id FROM Student WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // 2. Hash password
    const hashedPassword = await hash(password, SALT_ROUNDS);

    // 3. Insert new user
    const result = await db.query(
      "INSERT INTO Name (fname, lname) VALUES ($1,$2) RETURNING id",
      [fName,lName]
    );

    const nameId = result.rows[0].id;
    // console.log("nameiid  ",nameId)

     const res = await db.query(
      "INSERT INTO Student (email,password,name_id) VALUES ($1,$2,$3) RETURNING id,email",
      [email,hashedPassword,nameId]
    );

    if(res.rows.length>0)
    {
      const newUser=res.rows[0];
      return NextResponse.json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
      registerSuccess:true,
    });
    }

    return NextResponse.json({
      message: "Registration Error",
      error: "Registration Error",
      registerSuccess:false,
      
    });
    
  } catch (err) {
    console.error("Register error:", err.message,);
    return NextResponse.json({ error: "Server error", registerSuccess:false, }, { status: 500 });
  }
}
