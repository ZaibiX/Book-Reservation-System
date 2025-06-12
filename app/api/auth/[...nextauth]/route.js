import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "../../../../utils/db.js";

// Separate the configuration object
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials, req) {
        const { email, password, role } = credentials;

        try {
          let user;
          let name;

          if (!role || !["student", "librarian"].includes(role)) {
            throw new Error("Invalid role specified");
          }

          const table = role === "student" ? "Student" : "Librarian";

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
        token.role = user.role;
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
};

// Create the handler using the authOptions
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };