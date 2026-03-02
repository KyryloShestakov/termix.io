'use client';
import { useEffect, useState } from "react";
import { User } from "@supabase/auth-js";
import { getSubscriptions } from "@/lib/api/subsriptions";
import VideoService from "@/lib/services/VideoService";
import { Video } from "@/types";
import VideoGrid from "@/components/Grid/video-grid";
import getChannel from "@/lib/api/channel";
import {redirect} from "next/navigation";

type Props = {
    user: User;
};

export default function Subscriptions({ user }: Props) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            console.log("Fetching subscriptions for user:", user.id);
            setLoading(true);

            const subscriptions = await getSubscriptions(user.id);
            console.log("Subscriptions:", subscriptions);

            if (!subscriptions || subscriptions.length === 0) {
                setVideos([]);
                setLoading(false);
                return;
            }

            const videoService = new VideoService();
            const allVideos: Video[] = [];

            // разобраться а то я в подписки записываю айди юзера а не айди канала
            for (const sub of subscriptions) {
                console.log("Fetching videos for channel:", sub.channel_id);
                const channelId = await getChannel(sub.channel_id)
                const channelVideos = await videoService.getVideos(channelId?.id);
                console.log(`Found ${channelVideos.length} videos for channel ${sub.channel_id}`);
                const videosPublic = channelVideos.filter(v => !v.is_private)
                allVideos.push(...videosPublic);
            }

            console.log("Total videos collected:", allVideos.length);
            setVideos(allVideos);
            setLoading(false);
        };

        fetchVideos();
    }, [user.id]);

    if (loading) return <p>Loading...</p>;
    if (videos.length === 0) return <p>No videos from subscriptions yet</p>;

    return <VideoGrid videos={videos} isVertical={false}/>;
}
