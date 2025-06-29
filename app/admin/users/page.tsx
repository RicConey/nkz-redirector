// app/admin/users/page.tsx

import React from 'react'
import { requireAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import UsersManager from '@/components/admin/users/UsersManager'
import type { UserRow } from '@/components/admin/users/UsersTable'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
    const denied = await requireAdmin()
    if (denied) return denied

    const usersRaw = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { links: true, RedirectLog: true } },
        },
    })

    const users: UserRow[] = usersRaw.map(u => ({
        id: u.id,
        fullName: u.fullName,
        phone: u.phone,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString(),
        slugCount: u._count.links,
        redirectCount: u._count.RedirectLog,
    }))

    return (
        <div className="p-6">
            <UsersManager users={users} />
        </div>
    )
}