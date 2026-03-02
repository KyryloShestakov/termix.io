import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()
    const [supabase] = await Promise.all([createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value}) => {
                        request.cookies.set(name, value)
                    })
                },
            },
        }
    )])

    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    const publicRoutes = ['/','/auth/callback', '/auth/auth-error']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (user && ['/auth/callback'].includes(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    if (!isPublicRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = ''
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}