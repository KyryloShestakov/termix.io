// /app/api/search/route.ts
import { supabase } from "@/utils/supabase/supabase";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q) return Response.json([]);

    const { data } = await supabase
        .from("videos")
        .select("id, title")
        .ilike("title", `%${q}%`)
        .limit(10);

    return Response.json(data || []);
}
