import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "../../../../utils/db.js"; // use your DB util function
import { v4 as uuidv4 } from "uuid";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, // Add role field (or dropdown in UI)
      },

      async authorize(credentials, req) {
        const { email, password, role } = credentials;

        try {
          let user;
          let name;

          // Validate role
          if (!role || !["student", "librarian"].includes(role)) {
            throw new Error("Invalid role specified");
          }

          const table = role === "student" ? "Student" : "Librarian";

          // Query respective user
          const result = await db.query(
            `SELECT id, name_id, email, password FROM ${table} WHERE email = $1`,
            [email]
          );
          user = result.rows[0];

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isMatch = await compare(password, user.password);
          if (!isMatch) {
            throw new Error("Incorrect password");
          }

          // Get name
          const result2 = await db.query(
            "SELECT fname, lname FROM Name WHERE id = $1",
            [user.name_id]
          );
          name = result2.rows[0];

          return {
            id: user.id,
            email: user.email,
            name: `${name.fname} ${name.lname}`,
            role,
          };
        } catch (err) {
          console.error("Authorize error:", err.message);
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub;
      if (token?.role) session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Pass role into JWT
      }
      return token;
    },
  },

  pages: {
    signIn: "/student/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
