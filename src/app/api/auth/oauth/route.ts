// pages/api/auth/oauth.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) return NextResponse.redirect("/");

    const supabase = await createClient();

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) return NextResponse.redirect("/?error=" + error.message);

    return NextResponse.redirect("/channel");
}
