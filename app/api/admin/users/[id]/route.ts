// app/api/admin/users/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
            address: true,
            website: true,
            notes: true,
            role: true,
            isActive: true,
            createdAt: true,
            _count: { select: { links: true, RedirectLog: true } },
        },
    });

    if (!user) {
        return NextResponse.json({ error: 'Користувача не знайдено' }, { status: 404 });
    }

    // Формируем ответ
    return NextResponse.json({
        ...user,
        createdAt: user.createdAt.toISOString(),
        slugCount: user._count.links,
        redirectCount: user._count.RedirectLog,
    });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    const data = await request.json();

    const updated = await prisma.user.update({
        where: { id },
        data: {
            email: data.email,
            fullName: data.fullName,
            phone: data.phone,
            address: data.address,
            website: data.website,
            notes: data.notes,
            role: data.role,
            isActive: data.isActive,
        },
    });

    return NextResponse.json(updated);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
}
