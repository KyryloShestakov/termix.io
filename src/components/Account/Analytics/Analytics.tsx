"use client";

import { getViews } from "@/lib/analytics/views";
import { ChannelType } from "@/types";
import { useEffect, useState } from "react";

type AnalyticsProps = {
    channel: ChannelType | null;
};

export default function Analytics({ channel }: AnalyticsProps) {
    const [totalViews, setTotalViews] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!channel?.id) return;

        let isMounted = true;

        const fetchViews = async () => {
            setLoading(true);
            setError(null);

            try {
                const views = await getViews(channel.id);
                if (isMounted) {
                    setTotalViews(views);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError("Failed to load views");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchViews();

        return () => {
            isMounted = false;
        };
    }, [channel?.id]);

    return (
        <p>
            Total Views: {loading ? "..." : totalViews ?? 0}
            {error && <span style={{ color: "red" }}> ({error})</span>}
        </p>
    );
}