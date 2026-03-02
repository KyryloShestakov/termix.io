import { supabase } from "@/utils/supabase/supabase";
import {ChannelType} from "@/types/channel-type";

type InsertChannelProps = {
    name: string;
    isPrivate: boolean;
    userId: string;
};

export default async function getChannel(userId: string) {
    if (!userId) return null;
    const { data: channelData, error } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", userId)
        .single();

    if (error && error.code !== "PGRST116") {
        console.error("Supabase error:", error);
        throw new Error("Failed to fetch channel");
    }

    return channelData as ChannelType;
}

export async function insertChannel({ name, isPrivate, userId }: InsertChannelProps) {
    const { data, error } = await supabase
        .from("channels")
        .insert([
            {
                name: name.trim(),
                is_private: isPrivate,
                owner_id: userId,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error inserting channel:", error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function getChannelById(channelId: string): Promise<ChannelType | null> {
    const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("id", channelId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching channel:", error.message);
        return null;
    }

    return data;
}
