import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized({ token }) {
            return !!token; // защита всех страниц, требующих авторизации
        },
    },
});

export const config = { matcher: ["/admin/:path*", "/dashboard/:path*"] };
