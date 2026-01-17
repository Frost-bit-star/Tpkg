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
    // Runs on user login
    async signIn({ user }) {
      const { name, email, image: avatar } = user;

      try {
        // Insert new user or update existing one
        await db.query(
          `
          INSERT INTO users (name, email, avatar)
          VALUES ($1, $2, $3)
          ON CONFLICT (email)
          DO UPDATE SET name = $1, avatar = $3
          `,
          [name, email, avatar]
        );
        return true;
      } catch (err) {
        console.error("❌ Error saving user:", err);
        return false;
      }
    },

    // Runs whenever session is checked
    async session({ session }) {
      try {
        const result = await db.query(
          "SELECT id FROM users WHERE email = $1",
          [session.user.email]
        );

        if (result.rows[0]) {
          // Attach user ID from DB to session
          session.user.id = result.rows[0].id;
        }
      } catch (err) {
        console.error("❌ Error fetching user ID:", err);
      }

      return session;
    },

    // Optional: include email verification or custom JWT logic here
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/signin", // optional custom sign-in page
  },

  // You can enable debug during development
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
