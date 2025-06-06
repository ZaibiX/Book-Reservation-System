// app/api/login/route.js
import db from "@/utils/db.js";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {

    const data = await req.json();
    console.log(data, "frpm api bg")

    // Fetch user by email
    try{
        const result = await db.query("SELECT id,name_id, email FROM Student WHERE email = $1",[data.email]);
        // console.log(result.rows[0]);
        const user = result.rows[0];
        if(user)
        {
            const result = await db.query("SELECT name_id, email FROM Student WHERE email = $1 and password = $2",[data.email,data.password]);
            

            if(!result.rows[0])
            {
                return NextResponse.json({ error: "Invalid credentials",message:"Password not correct" }, { status: 401 });
            }
            const nameId= result.rows[0].name_id;
            
            const result2 = await db.query("SELECT fname, lname FROM Name WHERE id =$1",[nameId]);
            const user = 
            {   id:result.rows[0].id,
                email:result.rows[0].email,
                name:result2.rows[0].fname+" " +result2.rows[0].lname,
            }
             return NextResponse.json({ message: "User found", user:user });

        }


    }
    catch(err){
        console.error("Error while fetching", err.message)
    }

    return NextResponse.json({ error: "User not found" }, { status: 401 });

   
}

//     if (error || !user) {
//       return NextResponse.json({ error: "User not found" }, { status: 401 });
//     }

//     const passwordMatch = await compare(password, user.password);

//     if (!passwordMatch) {
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//     }

//     // ✅ You can set cookie, token, or session here
//     return NextResponse.json({
//       message: "Login successful",
//       user: {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//       },
//     });
//   } catch (err) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
