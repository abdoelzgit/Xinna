import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                // 1. Cek di tabel User (Staff)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (user && user.password) {
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (isValid) {
                        return {
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                            jabatan: user.jabatan,
                            userType: "staff"
                        };
                    }
                }

                // 2. Cek di tabel Pelanggan (Customer)
                const pelanggan = await prisma.pelanggan.findUnique({
                    where: { email: credentials.email }
                });

                if (pelanggan && pelanggan.katakunci) {
                    const isValid = await bcrypt.compare(credentials.password, pelanggan.katakunci);
                    if (isValid) {
                        return {
                            id: pelanggan.id.toString(),
                            name: pelanggan.nama_pelanggan,
                            email: pelanggan.email,
                            jabatan: "pelanggan",
                            userType: "customer"
                        };
                    }
                }

                throw new Error("Email atau password salah");
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const email = user.email;
                if (!email) return false;

                // Cek apakah sudah ada di User (Staff)
                const existingUser = await prisma.user.findUnique({
                    where: { email }
                });

                if (existingUser) return true;

                // Cek apakah sudah ada di Pelanggan (Customer)
                const existingPelanggan = await prisma.pelanggan.findUnique({
                    where: { email }
                });

                if (!existingPelanggan) {
                    // Buat Pelanggan baru jika belum ada
                    await prisma.pelanggan.create({
                        data: {
                            nama_pelanggan: user.name || "User Google",
                            email: email,
                            katakunci: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password for safety
                        }
                    });
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                // Determine userType and jabatan for Google login
                if (account?.provider === "google") {
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
                    if (dbUser) {
                        token.id = dbUser.id.toString();
                        token.jabatan = dbUser.jabatan;
                        token.userType = "staff";
                    } else {
                        const dbPelanggan = await prisma.pelanggan.findUnique({ where: { email: user.email! } });
                        if (dbPelanggan) {
                            token.id = dbPelanggan.id.toString();
                            token.jabatan = "pelanggan";
                            token.userType = "customer";
                        }
                    }
                } else {
                    // Credentials login already provides these
                    token.id = user.id;
                    token.jabatan = (user as any).jabatan;
                    token.userType = (user as any).userType;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).jabatan = token.jabatan;
                (session.user as any).userType = token.userType;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
