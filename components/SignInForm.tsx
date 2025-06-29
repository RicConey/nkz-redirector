'use client'

import React, { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Errors {
    email?: string
    password?: string
    submit?: string
}

interface Props {
    csrfToken: string | null
}

export default function SignInForm({ csrfToken }: Props) {
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors]     = useState<Errors>({})
    const [loading, setLoading]   = useState(false)
    const router = useRouter()

    // Валидируем поля при каждом изменении
    useEffect(() => {
        const errs: Errors = {}
        if (!email) {
            errs.email = 'Email обов’язковий'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = 'Невірний формат email'
        }
        if (!password) {
            errs.password = 'Пароль обов’язковий'
        } else if (password.length < 6) {
            errs.password = 'Пароль має містити ≥6 символів'
        }
        setErrors(errs)
    }, [email, password])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // если есть ошибки — не шлём
        if (Object.keys(errors).length > 0) return

        setLoading(true)
        const res = await signIn('credentials', { redirect: false, email, password })
        setLoading(false)

        if (res?.error) {
            setErrors({ submit: 'Невірний email або пароль' })
            return
        }

        const session = await getSession()
        const role = session?.user.role
        router.push(role === 'ADMIN' ? '/admin/links' : '/dashboard/links')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="csrfToken" type="hidden" defaultValue={csrfToken ?? ''} />
            <div>
                <label htmlFor="email" className="block text-sm mb-1">Email</label>
                <input
                    id="email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm mb-1">Пароль</label>
                <input
                    id="password" type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>

            {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

            <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className={`w-full py-2 rounded text-white ${
                    loading || Object.keys(errors).length > 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? 'Вхід...' : 'Увійти'}
            </button>
        </form>
    )
}
