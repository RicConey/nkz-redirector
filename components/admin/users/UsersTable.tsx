// components/admin/users/UsersTable.tsx

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

export interface UserRow {
    id: string
    fullName: string | null
    phone: string | null
    isActive: boolean
    createdAt: string
    slugCount: number
    redirectCount: number
}

interface Props {
    users: UserRow[]
}

export default function UsersTable({ users }: Props) {
    const router = useRouter()

    return (
        <table className="min-w-full table-auto border-collapse">
            <thead>
            <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Ім’я</th>
                <th className="px-4 py-2 text-left">Телефон</th>
                <th className="px-4 py-2 text-left">Активний</th>
                <th className="px-4 py-2 text-left">Дата створення</th>
                <th className="px-4 py-2 text-left">Кількість slug-ів</th>
                <th className="px-4 py-2 text-left">Кількість переходів</th>
            </tr>
            </thead>
            <tbody>
            {users.map(user => (
                <tr
                    key={user.id}
                    onClick={() => router.push(`/admin/users/${user.id}/info`)}
                    className="cursor-pointer hover:bg-gray-50 border-t"
                >
                    <td className="px-4 py-2">{user.fullName ?? '—'}</td>
                    <td className="px-4 py-2">{user.phone ?? '—'}</td>
                    <td className="px-4 py-2">{user.isActive ? 'Так' : 'Ні'}</td>
                    <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString('uk-UA')}</td>
                    <td className="px-4 py-2">{user.slugCount}</td>
                    <td className="px-4 py-2">{user.redirectCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}