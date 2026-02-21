import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp-login",
      name: "OTP Login",
      credentials: {
        username: { label: "Username", type: "text" },
        otpCode: { label: "OTP Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.otpCode) return null;

        if (credentials.username !== process.env.ADMIN_USERNAME) return null;

        const otp = await prisma.otpCode.findFirst({
          where: {
            code: credentials.otpCode,
            used: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otp) return null;

        await prisma.otpCode.update({
          where: { id: otp.id },
          data: { used: true },
        });

        return {
          id: "admin",
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60, // 24시간 (초) - 브라우저 종료 후에도 쿠키 유지
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
