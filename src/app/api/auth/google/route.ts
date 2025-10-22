// app/auth/google/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request, { params }: { params: { provider: string } }) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}auth/callback`,
        },
    })

    if (error) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=${error.message}`)
    }

    return NextResponse.redirect(data.url)
}
