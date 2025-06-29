// components/admin/users/SlugsTable.tsx

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'

export interface SlugRow {
    id: string
    slug: string
    targetUrl: string
    isActive: boolean
    createdAt: string
    redirectCount: number
}

interface Props {
    slugs: SlugRow[]
}

export default function SlugsTable({ slugs }: Props) {
    const router = useRouter()

    return (
        <table className="min-w-full table-auto border-collapse">
            <thead>
            <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Слаг</th>
                <th className="px-4 py-2 text-left">Призначення</th>
                <th className="px-4 py-2 text-left">Активність</th>
                <th className="px-4 py-2 text-left">Дата створення</th>
                <th className="px-4 py-2 text-left">Кількість переходів</th>
            </tr>
            </thead>
            <tbody>
            {slugs.map(s => (
                <tr
                    key={s.id}
                    onClick={() => router.push(`/admin/links/${s.id}`)}
                    className="cursor-pointer hover:bg-gray-50 border-t"
                >
                    <td className="px-4 py-2 break-all">{s.slug}</td>
                    <td className="px-4 py-2 break-all">{s.targetUrl}</td>
                    <td className="px-4 py-2">{s.isActive ? 'Так' : 'Ні'}</td>
                    <td className="px-4 py-2">{format(new Date(s.createdAt), 'Pp', { locale: uk })}</td>
                    <td className="px-4 py-2">{s.redirectCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}