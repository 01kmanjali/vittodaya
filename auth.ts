import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await User.findOne({
          email: String(credentials.email).toLowerCase(),
        }).select("+password");
        if (!user) return null;
        const valid = await user.comparePassword(String(credentials.password));
        if (!valid) return null;
        if (user.status === "inactive") return null;
        if (user.status === "pending") return null; // email not verified yet
        user.lastLogin = new Date();
        await user.save();
        return {
          id:    user.id,
          name:  user.name,
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
