// lib/auth-options.ts

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Email + Пароль',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
                password: { label: 'Пароль', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null
                const user = await prisma.user.findUnique({ where: { email: credentials.email } })
                if (!user) return null
                const valid = await compare(credentials.password, user.password)
                if (!valid) return null
                return { id: user.id, email: user.email, role: user.role }
            },
        }),
    ],
    session: { strategy: 'jwt' },
    pages: { signIn: '/auth/signin' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub!
                session.user.role = token.role!
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
