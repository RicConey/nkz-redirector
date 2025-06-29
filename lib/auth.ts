// lib/auth.ts

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

/**
 * Проверяет, что пользователь залогинен и имеет роль 'admin'.
 * Если не залогинен – делает redirect на страницу /auth/signin.
 * Если залогинен, но не админ – возвращает 403.
 * Иначе – возвращает null, чтобы страница продолжила рендер.
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    // Если нет сессии – редирект на логин
    if (!session?.user) {
        redirect('/auth/signin');
        // redirect автоматически прерывает рендер
    }

    // Если пользователь есть, но не админ – 403
    if (session.user.role !== 'ADMIN') {
        return new NextResponse('Доступ заборонено', { status: 403 });
    }

    // Всё ок
    return null;
}
