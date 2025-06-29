import { PrismaClient } from '@prisma/client';

// Для корректной работы при горячей перезагрузке (HMR) в режиме разработки
// используем глобальную переменную, чтобы не создавать несколько экземпляров клиента.
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
    log: [
        { level: 'query', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
    ],
});

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}

export default prisma;
