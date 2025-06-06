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
    const result = await db.query("SELECT id, name_id, email, password FROM Student WHERE email = $1", [email]);
    const user = result.rows[0];
    
    if (!user) return null;

    // Compare plaintext password (you should hash it in real apps)
    if (user.password !== password) return null;

    const nameId = user.name_id;
    const result2 = await db.query("SELECT fname, lname FROM Name WHERE id = $1", [nameId]);
    const name = result2.rows[0];
    console.log("suc logined ")
    return {
      id: user.id,
      email: user.email,
      name: `${name.fname} ${name.lname}`,
    };
  } catch (err) {
    console.error('Authorize error:', err);
    return null;
  }
},

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
