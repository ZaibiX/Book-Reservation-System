import {hash} from "bcrypt";
import { NextResponse } from "next/server";
export async function GET(req)
{
    console.log("code is: ",await hash("admin123", 10));
    return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
}