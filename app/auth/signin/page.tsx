// app/auth/signin/page.tsx
import { getCsrfToken } from 'next-auth/react'
import SignInForm from '@/components/SignInForm'

export default async function SignInPage() {
    // getCsrfToken может вернуть string | null | undefined
    const csrfRaw = await getCsrfToken()
    // приводим к типу string | null
    const csrfToken: string | null = csrfRaw ?? null

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded shadow">
                <h1 className="text-2xl font-bold mb-6 text-center">Вход</h1>
                <SignInForm csrfToken={csrfToken} />
            </div>
        </div>
    )
}
