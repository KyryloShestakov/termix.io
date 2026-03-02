import {ProfileType} from "@/types";
import {supabase} from "@/utils/supabase/supabase";

type Props = {
    userId: string | null;
}

export async function getProfileById(userId: Props): Promise<ProfileType | null> {
    if (!userId) {
        return null;
    }
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching profile:", error.message);
        return null;
    }

    return data;
}