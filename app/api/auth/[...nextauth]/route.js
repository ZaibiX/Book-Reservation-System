import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import db  from '../../../../utils/db.js' // use your DB util function
import { v4 as uuidv4 } from 'uuid'

const handler = NextAuth({
  providers: [
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      
async authorize(credentials, req) {
  const { email, password } = credentials;

  try {
    // 1. Fetch user by email
    const result = await db.query(
      "SELECT id, name_id, email, password FROM Student WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) return null;

    // 2. Compare plaintext password with hashed password
    const isMatch = await compare(password, user.password);
    if (!isMatch) return null;

    // 3. Fetch name from Name table
    const result2 = await db.query(
      "SELECT fname, lname FROM Name WHERE id = $1",
      [user.name_id]
    );
    const name = result2.rows[0];

    // 4. Return user session object
    return {
      id: user.id,
      email: user.email,
      name: `${name.fname} ${name.lname}`,
    };
  } catch (err) {
    console.error("Authorize error:", err);
    return null;
  }
}

    }),
  ],
  callbacks: {
    
    async session({ session, token }) {
      if (token?.sub) session.user.id = token.sub
      return session
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
  },
  pages: {
    signIn: '/student/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
})

export { handler as GET, handler as POST }
