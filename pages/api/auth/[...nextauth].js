// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../lib/db.js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // save user in DB
      const { name, email, image: avatar } = user;
      await db.query(
        `INSERT INTO users (name,email,avatar)
         VALUES ($1,$2,$3)
         ON CONFLICT (email) DO UPDATE SET name=$1, avatar=$3`,
        [name, email, avatar]
      );
      return true;
    },
    async session({ session }) {
      return session; // session contains user info
    },
  },
};

export default NextAuth(authOptions);
