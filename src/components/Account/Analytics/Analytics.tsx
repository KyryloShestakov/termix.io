"use client"

import {getViews} from "@/lib/analytics/views";
import {ChannelType} from "@/types";
import {User} from "@supabase/auth-js";
import {useEffect, useState} from "react";

type AnalyticsProps = {
    user: User,
    channel: ChannelType | null,
}

export default function Analytics({channel, user}: AnalyticsProps) {
    const [totalViews, setTotalViews] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchViews = async () => {
            setLoading(true);
            setError(null);

            try {
                const views = await getViews(channel?.id as string);
                setTotalViews(views);
            } catch (err: any) {
                console.error(err);
                setError("Failed to load views");
            } finally {
                setLoading(false);
            }
        };

        fetchViews();
    }, [channel?.id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{color: "red"}}>{error}</p>;

    return <p>Total Views: {totalViews ?? 0}</p>;
}