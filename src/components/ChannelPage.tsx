"use client";

import { useEffect, useState } from "react";
import ChannelSideBar from "@/components/Side-bar/channel-side-bar";
import VideoGrid from "@/components/Grid/video-grid";
import ChannelModal from "@/components/Modals/сhannel-modal";
import { Video } from "@/types/video-type";
import { Channel } from "@/types/channel-type";
import { User } from "@supabase/auth-js";
import { supabase } from "@/lib/supabase";
import getChannel from "@/lib/api/channel";
import getVideos from "@/lib/api/videos";
import '@/app/channel/channel-page-styles.css';

export default function ChannelPage() {
    const [user, setUser] = useState<User | null>(null);
    const [channel, setChannel] = useState<Channel | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        fetchUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const ch = await getChannel(user.id);
            setChannel(ch);

            if (ch) {
                const vids = await getVideos(ch.id);
                setVideos(vids);
            }
        };

        fetchData();
    }, [user]);

    return (
        <div className="channel-page-wrapper">
            <ChannelSideBar/>
            <main className="channel-main">
                {!channel ? (
                    <button className="create-channel-btn" onClick={() => setIsModalOpen(true)}>
                        + Create Channel
                    </button>
                ) : (
                    <div>
                        <div className="channel-card">
                            <div className="channel-header">
                                <div className="avatar">
                                    {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                                </div>
                                <h2>
                                    {channel.name} {channel.is_private ? "(Private)" : "(Public)"}
                                </h2>
                            </div>
                        </div>
                        <VideoGrid videos={videos}/>
                    </div>
                )}
                {user && (
                    <ChannelModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        userId={user.id}
                    />
                )}
            </main>
        </div>
    );
}
