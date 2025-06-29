import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { UAParser } from 'ua-parser-js'

// Ключевые слова, по которым определяем ботов
const BOT_KEYWORDS = [
    'bot', 'crawl', 'spider', 'slurp', 'fetch', 'facebook', 'telegram', 'discord',
    'preview', 'scan', 'python', 'node', 'axios', 'curl', 'wget', 'ahrefs', 'semrush',
    'mj12bot', 'yandex', 'headless', 'lighthouse'
]

function isBot(userAgent: string): boolean {
    const ua = userAgent.toLowerCase()
    return BOT_KEYWORDS.some(bot => ua.includes(bot))
}

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
    const { slug } = await context.params

    const method = req.method
    if (method !== 'GET') {
        return new NextResponse('Method Not Allowed', { status: 405 })
    }

    const rawUA = req.headers.get('user-agent') ?? ''
    if (isBot(rawUA)) {
        return NextResponse.redirect(`https://nkz.com.ua/${slug}`)
    }

    const link = await prisma.link.findUnique({ where: { slug } })
    const now = new Date()

    if (!link || !link.isActive || now < link.validFrom || now > link.validTo) {
        return new NextResponse('Not found', { status: 404 })
    }

    // IP
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        req.headers.get('x-real-ip') ??
        'unknown'

    // User-Agent парсинг
    const parser = new UAParser(rawUA)
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const device = parser.getDevice()

    const userAgent = `${browser.name ?? 'Unknown'} ${browser.version ?? ''} on ${os.name ?? 'Unknown'} ${os.version ?? ''}`.trim()
    const deviceInfo = device.vendor
        ? `${device.vendor} ${device.model} (${device.type ?? 'desktop'})`
        : device.model
            ? `${device.model} (${device.type ?? 'desktop'})`
            : 'Desktop'

    // 💡 Мини-защита от дублей: если referer содержит тот же slug, пропустить
    const referer = req.headers.get('referer') ?? ''
    if (referer.includes(`/` + slug)) {
        return NextResponse.redirect(link.targetUrl)
    }

    await prisma.redirectLog.create({
        data: {
            slug: link.slug,
            targetUrl: link.targetUrl,
            ownerId: link.ownerId,
            ip,
            userAgent,
            deviceInfo,
        },
    })

    return NextResponse.redirect(link.targetUrl)
}
