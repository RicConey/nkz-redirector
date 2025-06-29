// app/api/admin/users/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
    const denied = await requireAdmin()
    if (denied) return denied

    const usersRaw = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { links: true, RedirectLog: true } } },
    })

    const users = usersRaw.map(u => ({
        id: u.id,
        fullName: u.fullName,
        phone: u.phone,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        slugCount: u._count.links,
        redirectCount: u._count.RedirectLog,
    }))

    return NextResponse.json(users)
}

export async function POST(request: Request) {
    const denied = await requireAdmin()
    if (denied) return denied

    const {
        email,
        password,
        fullName,
        phone,
        address,
        website,
        notes,
        role,
        isActive,
    }: {
        email: string;
        password: string;
        fullName?: string;
        phone?: string;
        address?: string;
        website?: string;
        notes?: string;
        role: 'USER' | 'ADMIN';
        isActive: boolean;
    } = await request.json()

    const createdRaw = await prisma.user.create({
        data: { email, password, role, isActive, fullName, phone, address, website, notes },
        include: { _count: { select: { links: true, RedirectLog: true } } },
    })

    const created = {
        id: createdRaw.id,
        fullName: createdRaw.fullName,
        phone: createdRaw.phone,
        isActive: createdRaw.isActive,
        createdAt: createdRaw.createdAt.toISOString(),
        slugCount: createdRaw._count.links,
        redirectCount: createdRaw._count.RedirectLog,
    }

    return NextResponse.json(created)
}