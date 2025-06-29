// components/admin/users/CreateUserModal.tsx

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { UserRow } from './UsersTable'

interface Props {
    onClose: () => void
    onCreated?: (user: UserRow) => void
}

export default function CreateUserModal({ onClose, onCreated }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<'USER' | 'ADMIN'>('USER')
    const [isActive, setIsActive] = useState(true)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [website, setWebsite] = useState('')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    // Allow only digits, max 10
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, '')
        setPhone(digits.slice(0, 10))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const payload = {
            email,
            password,
            fullName,
            role,
            isActive,
            phone: phone ? `+38${phone}` : undefined,
            address: address || undefined,
            website: website || undefined,
            notes: notes || undefined,
        }
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const data = (await res.json()) as UserRow
        setLoading(false)
        if (res.ok) {
            onCreated?.(data)
            onClose()
            router.refresh()
        } else {
            alert((data as any).error || 'Помилка створення користувача')
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl mb-4">Новий користувач</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block font-medium">Email<span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block font-medium">Пароль<span className="text-red-500">*</span></label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength={6}
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}"
                            title="Мінімум 6 символів, латиниця, велика та мала букви, цифра або спецсимвол"
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block font-medium">Повне ім’я<span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            maxLength={255}
                            className="mt-1 w-full border rounded p-2"
                        />
                    </div>

                    {/* Role & Active */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
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

                    {/* Toggle advanced */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(prev => !prev)}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        {showAdvanced ? 'Приховати додаткове' : 'Показати додаткове'}
                    </button>

                    {showAdvanced && (
                        <div className="space-y-4 pt-2 border-t">
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
                                        onChange={handlePhoneChange}
                                        pattern="\d{10}"
                                        maxLength={10}
                                        placeholder="0991234567"
                                        className="mt-1 w-full border rounded-r p-2"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block font-medium">Адреса</label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    maxLength={255}
                                    className="mt-1 w-full border rounded p-2"
                                />
                            </div>

                            {/* Website */}
                            <div>
                                <label className="block font-medium">Сайт</label>
                                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 rounded-l">
                    https://
                  </span>
                                    <input
                                        type="text"
                                        value={website}
                                        onChange={e => setWebsite(e.target.value)}
                                        placeholder="example.com"
                                        pattern="^[\w.-]+(\.[\w.-]+)+.*$"
                                        title="Введіть допустимий домен після https://"
                                        className="mt-1 w-full border rounded-r p-2"
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block font-medium">Нотатки</label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    maxLength={256}
                                    className="mt-1 w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

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
                            {loading ? 'Створюється...' : 'Створити'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
