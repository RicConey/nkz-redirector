// components/Header.tsx
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'

export default function Header() {
    const { data: session, status } = useSession()
    const loading = status === 'loading'

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Лого / главная ссылка */}
                <Link href="/">
                    <span className="text-xl font-bold">NKZ Redirector</span>
                </Link>

                <nav className="flex items-center space-x-4">
                    {/* Пока загружаем сессию, ничего не показываем */}
                    {loading && null}

                    {/* Не залогинен: ссылка на вход */}
                    {!session && !loading && (
                        <Link
                            href="/auth/signin"
                            className="text-blue-600 hover:underline"
                        >
                            Увійти
                        </Link>
                    )}

                    {/* Залогинен */}
                    {session && (
                        <>
                            {/* Меню для админа */}
                            {session.user.role === 'ADMIN' ? (
                                <>
                                    <Link
                                        href="/admin/links"
                                        className="hover:underline"
                                    >
                                        Посилання
                                    </Link>
                                    <Link
                                        href="/admin/users"
                                        className="hover:underline"
                                    >
                                        Користувачі
                                    </Link>
                                    <Link
                                        href="/admin/logs"
                                        className="hover:underline"
                                    >
                                        Логи
                                    </Link>
                                </>
                            ) : (
                                /* Меню для обычного пользователя */
                                <>
                                    <Link
                                        href="/dashboard/links"
                                        className="hover:underline"
                                    >
                                        Мої посилання
                                    </Link>
                                    <Link
                                        href="/dashboard/logs"
                                        className="hover:underline"
                                    >
                                        Мої логи
                                    </Link>
                                </>
                            )}

                            {/* Кнопка выхода */}
                            <button
                                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                                className="ml-4 text-red-600 hover:underline"
                            >
                                Вийти
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}
