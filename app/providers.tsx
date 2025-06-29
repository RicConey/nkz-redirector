// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface ProvidersProps {
    children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <SessionProvider
            // через каждые 5 минут и при возвращении в окно проверять сессию
            refetchInterval={5 * 60}
            refetchOnWindowFocus={true}
        >
            {children}
        </SessionProvider>
    )
}
