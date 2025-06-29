// lib/slug.ts
import prisma from '@/lib/prisma'

const RESERVED_SLUGS = [
    'api', 'auth', 'admin', 'dashboard', 'links',
    'favicon.ico', 'robots.txt', 'sitemap.xml',
]

export async function generateUniqueSlug(length = 4): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let slug: string
    let exists: boolean
    do {
        slug = Array.from({ length }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
        ).join('')
        const inReserved = RESERVED_SLUGS.includes(slug)
        const inDb       = await prisma.link.findUnique({ where: { slug } })
        exists = inReserved || Boolean(inDb)
    } while (exists)
    return slug
}
