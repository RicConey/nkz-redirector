// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    const { email, password } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
        return NextResponse.json({ error: 'Email in use' }, { status: 409 });
    }
    const pwdHash = await hash(password, 12);
    const user = await prisma.user.create({
        data: { email, password: pwdHash },
    });
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
