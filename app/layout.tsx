// app/layout.tsx
import './globals.css'
import { PropsWithChildren } from 'react'
import { Providers } from './providers'
import Header from '@/components/Header'

export const metadata = {
    title: 'NKZ Redirector',
    description: 'QR-редиректы и управление ссылками',
}

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="ru">
        <body className="min-h-screen flex flex-col">
        <Providers>
            {/* Шапка с кнопкой “Выйти” */}
            <Header />

            {/* Основное содержимое */}
            <main className="flex-1">
                {children}
            </main>
        </Providers>
        </body>
        </html>
    )
}
