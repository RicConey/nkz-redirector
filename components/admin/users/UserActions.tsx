// components/admin/users/UserActions.tsx

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRow } from './UsersTable'
import EditUserModal from './EditUserModal'

interface Props {
    user: UserRow & {
        email: string
        fullName: string | null
        phone: string | null
        address: string | null
        website: string | null
        notes: string | null
        role: 'USER' | 'ADMIN'
    }
}

export default function UserActions({ user }: Props) {
    const [isActive, setIsActive] = useState(user.isActive)
    const [loading, setLoading] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const router = useRouter()

    const toggleActive = async () => {
        setLoading(true)
        await fetch(`/api/admin/users/${user.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !isActive }) })
        setIsActive(prev => !prev)
        setLoading(false)
    }

    const deleteUser = async () => {
        if (!confirm('Видалити користувача?')) return
        setLoading(true)
        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
        setLoading(false)
        router.push('/admin/users')
    }

    const handleUpdate = () => {
        router.refresh()
        setShowEdit(false)
    }

    return (
        <div className="flex space-x-3">
            <button
                onClick={() => setShowEdit(true)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                Редагувати
            </button>
            <button
                onClick={toggleActive}
                disabled={loading}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
            >
                {isActive ? 'Заморозити' : 'Розморозити'}
            </button>
            <button
                onClick={deleteUser}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
                Видалити
            </button>
            {showEdit && (
                <EditUserModal
                    initialData={user}
                    onClose={() => setShowEdit(false)}
                    onSaved={handleUpdate}
                />
            )}
        </div>
    )
}