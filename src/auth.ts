//This file is not used to trigger the middleware, it will use prisma adapter

import NextAuth, { type DefaultSession, type User } from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import db from "@/lib/db"
import { getUserById } from "./data/user"

const prisma = new PrismaClient()

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    }
  },
  callbacks: {

    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) return false;
      //todo:2fa
      return true;
    },

    async session({ session, token, user }) {
      //user is the user object from the database, token is the JWT token created during sign-in

      // session.user.customField = 'some value';
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      console.log("Session Callback:", session);
      return session;
    },
    async jwt({ token, user }) {
      // if(!token.sub) {return token;}
      console.log("JWT Callback:", token);
      return token;
    },//jwt is used to store user information in the token which is created during sign-in by session next-auth
  },

  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
}) 