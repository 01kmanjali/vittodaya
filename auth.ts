import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import speakeasy from "speakeasy";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:           { label: "Email",    type: "email"    },
        password:        { label: "Password", type: "password" },
        twoFactorToken:  { label: "2FA Code", type: "text"     },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({
          email: String(credentials.email).toLowerCase(),
        }).select("+password +twoFactorSecret");
        if (!user) return null;
        const valid = await user.comparePassword(String(credentials.password));
        if (!valid) return null;
        if (user.status === "inactive") return null;
        if (user.status === "pending") return null;

        // 2FA check — preflight already confirmed 2FA is required, so token must be present and valid
        if (user.twoFactorEnabled) {
          const token = String(credentials.twoFactorToken ?? "").trim();
          if (!token) return null;
          const ok = speakeasy.totp.verify({
            secret:   user.twoFactorSecret!,
            encoding: "base32",
            token,
            window:   1,
          });
          if (!ok) return null;
        }

        user.lastLogin = new Date();
        await user.save();
        return {
          id:   user.id,
          name: user.name,
          email: user.email,
          role:  user.role,
        };
      },
    }),
    // Google is optional – set GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET to enable
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          Google({
            clientId:     process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            async profile(profile) {
              // find or create user in MongoDB
              await connectDB();
              let user = await User.findOne({ email: profile.email.toLowerCase() });
              if (!user) {
                user = await User.create({
                  name:   profile.name,
                  email:  profile.email.toLowerCase(),
                  phone:  "",
                  password: Math.random().toString(36), // unusable placeholder
                  role:   "user",
                  status: "active",
                });
              }
              return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
          }),
        ]
      : []),
  ],
});
