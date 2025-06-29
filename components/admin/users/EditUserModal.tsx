'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRow } from './UsersTable'

interface Props {
    initialData: UserRow & {
        email: string
        fullName: string | null
        phone: string | null
        address: string | null
        website: string | null
        notes: string | null
        role: 'USER' | 'ADMIN'
    }
    onClose: () => void
    onSaved?: () => void
}

export default function EditUserModal({ initialData, onClose, onSaved }: Props) {
    const [email, setEmail] = useState(initialData.email)
    const [fullName, setFullName] = useState(initialData.fullName || '')
    const [phone, setPhone] = useState(initialData.phone?.replace('+38', '') || '')
    const [role, setRole] = useState<'USER' | 'ADMIN'>(initialData.role)
    const [isActive, setIsActive] = useState(initialData.isActive)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const payload = {
            email,
            fullName,
            phone: phone ? `+38${phone}` : undefined,
            role,
            isActive,
        }
        await fetch(`/api/admin/users/${initialData.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        setLoading(false)
        onSaved?.()
        onClose()
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl mb-4">Редагувати користувача</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block font-medium">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>
                    {/* Full Name */}
                    <div>
                        <label className="block font-medium">
                            Повне ім’я<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            maxLength={255}
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>
                    {/* Phone */}
                    <div>
                        <label className="block font-medium">Телефон</label>
                        <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 rounded-l">
                +38
              </span>
                            <input
                                type="text"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                pattern="\d{10}"
                                placeholder="0991234567"
                                className="mt-1 w-full border rounded-r p-2"
                            />
                        </div>
                    </div>
                    {/* Role & Active */}
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="block font-medium mr-2">Роль</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value as 'USER' | 'ADMIN')}
                                className="border rounded p-2"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={e => setIsActive(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="isActive">Активний</label>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Відмінити
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                        >
                            {loading ? 'Зберігається...' : 'Зберегти'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
