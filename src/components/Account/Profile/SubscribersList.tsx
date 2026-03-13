import { User } from "@supabase/auth-js";
import { useEffect, useState } from "react";
import { getSubscriptions } from "@/lib/api/subsriptions";
import getChannel from "@/lib/api/channel";
import { Subscription } from "@/types";

type SubscribersListProps = {
    user: User;
};

export default function SubscribersList({ user }: SubscribersListProps) {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [channelNames, setChannelNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubscriptions() {
            setLoading(true);
            const data = await getSubscriptions(user.id);
            // @ts-ignore
            setSubscriptions(data || []);
            setLoading(false);
        }

        fetchSubscriptions();
    }, [user.id]);

    useEffect(() => {
        async function fetchChannelNames() {
            if (subscriptions.length === 0) return;

            const names: Record<string, string> = {};

            await Promise.all(
                subscriptions.map(async (sub) => {
                    try {
                        const channel = await getChannel(sub.channel_id);
                        names[sub.channel_id] = channel?.name || "Unknown channel";
                    } catch (err) {
                        console.error("Error loading channel:", err);
                        names[sub.channel_id] = "Error loading";
                    }
                })
            );

            setChannelNames(names);
        }

        fetchChannelNames();
    }, [subscriptions]);

    if (loading) return <p>Loading subscriptions...</p>;

    return (
        <div>
            <h1>Subscriptions</h1>
            {subscriptions.length > 0 ? (
                <ul>
                    {subscriptions.map((sub) => (
                        <li key={sub.id}>
                            {channelNames[sub.channel_id] || "Loading..."}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No subscriptions yet.</p>
            )}
        </div>
    );
}
