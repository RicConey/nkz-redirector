// app/admin/users/[id]/info/page.tsx

import React from 'react'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import UserActions from '@/components/admin/users/UserActions'
import SlugsTable, { SlugRow } from '@/components/admin/users/SlugsTable'
import type { UserRow } from '@/components/admin/users/UsersTable'

interface PageProps {
    params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function UserInfoPage({ params }: PageProps) {
    const denied = await requireAdmin()
    if (denied) return denied

    const { id } = await params

    const userRaw = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            isActive: true,
            phone: true,
            address: true,
            website: true,
            notes: true,
            createdAt: true,
        },
    })
    if (!userRaw) {
        return <div className="p-6 text-red-600">Користувача не знайдено</div>
    }

    const links = await prisma.link.findMany({
        where: { ownerId: id },
        orderBy: { createdAt: 'desc' },
    })

    const userSlugs: SlugRow[] = await Promise.all(
        links.map(async link => {
            const redirectCount = await prisma.redirectLog.count({ where: { slug: link.slug } })
            return {
                id: link.id,
                slug: link.slug,
                targetUrl: link.targetUrl,
                isActive: link.isActive,
                createdAt: link.createdAt.toISOString(),
                redirectCount,
            }
        })
    )

    const user: UserRow & { email: string; role: 'USER' | 'ADMIN'; address: string | null; website: string | null; notes: string | null } = {
        id: userRaw.id,
        fullName: userRaw.fullName,
        phone: userRaw.phone,
        isActive: userRaw.isActive,
        createdAt: userRaw.createdAt.toISOString(),
        slugCount: links.length,
        redirectCount: userSlugs.reduce((sum, s) => sum + s.redirectCount, 0),
        email: userRaw.email,
        role: userRaw.role,
        address: userRaw.address,
        website: userRaw.website,
        notes: userRaw.notes,
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header with name and actions */}
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">{user.fullName ?? user.email}</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <UserActions user={user} />
                </div>
                {/* Vertical list of user info */}
                <div className="mt-4 space-y-2">
                    <p><strong>Роль:</strong> {user.role}</p>
                    <p><strong>Активний:</strong> {user.isActive ? 'Так' : 'Ні'}</p>
                    {user.phone && <p><strong>Телефон:</strong> {user.phone}</p>}
                    {user.address && <p><strong>Адреса:</strong> {user.address}</p>}
                    {user.website && (
                        <p><strong>Сайт:</strong>{' '}
                            <a href={user.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                                {user.website}
                            </a>
                        </p>
                    )}
                    {user.notes && <p><strong>Нотатки:</strong> {user.notes}</p>}
                    <p><strong>Створено:</strong> {format(new Date(user.createdAt), 'Pp', { locale: uk })}</p>
                    <p>
                        <Link href="/admin/users" className="text-blue-600 hover:underline">
                            Назад до списку
                        </Link>
                    </p>
                </div>
            </div>

            {/* Slugs Table */}
            <div>
                <h2 className="text-xl font-medium mb-2">Slugs користувача</h2>
                <SlugsTable slugs={userSlugs} />
            </div>
        </div>
    )
}
