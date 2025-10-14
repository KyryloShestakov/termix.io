import {supabase} from "@/lib/supabase";

export default async function getChannel(userId: string) {
    const { data: channelData, error: channelError } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", userId)
        .single();
    return channelData;
}