"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ChannelModal from "@/components/Modals/сhannel-modal";
import "./channel-page-styles.css";
import Header from "@/components/Header/Header";
import ChannelSideBar from "@/components/Side-bar/channel-side-bar";
import useUser from "@/components/Fetch/use-user";
import FetchVideos from "@/components/Videos/get-videos";
import Link from "next/link";
import VideoGrid from "@/components/Grid/video-grid";

type Video = {
    id: string;
    title: string;
    description: string;
    file_path: string;
    is_private: boolean;
    url: string | null;
    [key: string]: any;
};


export default function ChannelPage() {
    const user = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [channel, setChannel] = useState<any | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);

    useEffect(() => {
        if (!user) return;

        const fetchChannelAndVideos = async () => {
            try {
                const { data: channelData, error: channelError } = await supabase
                    .from("channels")
                    .select("*")
                    .eq("owner_id", user.id)
                    .single();


                setChannel(channelData);

                if (channelData?.id) {
                    const vids = await FetchVideos(channelData.id, undefined);
                    console.log("Fetched videos with URLs:", vids);
                    setVideos(vids);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchChannelAndVideos();
    }, [user]);


    return (
        <div>
            <Header onOpenAuthModal={() => setIsModalOpen(true)}></Header>
        <div className="channel-page-wrapper">

            {/* Sidebar */}
            <ChannelSideBar/>

            {/* Main content */}
            <main className="channel-main">
                {!channel ? (

                    <button
                        className="create-channel-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Create Channel
                    </button>
                ) : (
                    <div>
                        <div className="channel-card">
                            <div className="channel-header">
                                <div className="avatar">
                                    {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
                                </div>
                                <h2>{channel.name} {channel.is_private ? "(Private)" : "(Public)"}</h2>
                            </div>
                        </div>
                        <div>
                            <VideoGrid videos={videos}/>
                        </div>
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
        </div>
    );
}
