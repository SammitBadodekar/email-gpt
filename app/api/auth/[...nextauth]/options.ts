import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const options: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn(message) {
      console.log(message);
      const existingUser = await prisma.user.findUnique({
        where: {
          id: message.user.id,
        },
      });
      if (!existingUser) {
        await prisma.user.create({
          data: {
            id: message.user.id,
            name: message.user.name,
            email: message.user.email,
            image: message.user.image,
          },
        });
      }
    },
  },
  session: {
    strategy: "jwt",
  },
};
