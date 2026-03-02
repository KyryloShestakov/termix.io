import { supabase } from "@/utils/supabase/supabase";
import { Subscription } from "@/types";

export async function getSubscribers(channelId: string): Promise<Subscription[] | null> {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("channel_id", channelId);

    if (error) {
        console.error("Error fetching subscribers:", error.message);
        return null;
    }

    return data;
}

export async function getSubscriptions(subscriberId: string): Promise<Subscription[] | null> {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("subscriber_id", subscriberId);

    if (error) {
        console.error("Error fetching subscriptions:", error.message);
        return null;
    }

    return data;
}

export async function subscribe(subscriberId: string, channelId: string): Promise<Subscription | null> {
    console.log("Subscribing:", { subscriberId, channelId });

    if (!subscriberId || !channelId) {
        console.error("Missing subscriberId or channelId");
        return null;
    }

    const { data, error } = await supabase
        .from("subscriptions")
        .upsert({ subscriber_id: subscriberId, channel_id: channelId })
        .select()
        .maybeSingle();

    if (error) {
        console.error("Error creating subscription:", error.message);
        return null;
    }

    return data;
}

export async function unsubscribe(subscriberId: string, channelId: string): Promise<boolean> {
    const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_id", subscriberId)
        .eq("channel_id", channelId);

    if (error) {
        console.error("Error deleting subscription:", error.message);
        return false;
    }

    return true;
}

export async function countSubscribers(channelId: string): Promise<number> {
    const { count, error } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("channel_id", channelId);

    if (error) {
        console.error("Error counting subscribers:", error.message);
        return 0;
    }

    return count || 0;
}

export async function countSubscriptions(subscriberId: string): Promise<number> {
    const { count, error } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("subscriber_id", subscriberId);

    if (error) {
        console.error("Error counting subscriptions:", error.message);
        return 0;
    }

    return count || 0;
}

export async function getSubscription(subscriberId: string, channelId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("subscriber_id", subscriberId)
        .eq("channel_id", channelId)
        .maybeSingle();

    if (error) {
        console.error("Error checking subscription:", error.message);
        return false;
    }

    return !!data;
}
