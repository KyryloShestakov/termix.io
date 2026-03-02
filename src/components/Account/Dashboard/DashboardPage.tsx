"use client";

import { useEffect, useState } from "react";
import AccountViewController from "@/components/Account/Account-view-controller";
import VideoGrid from "@/components/Grid/video-grid";
import ChannelModal from "@/components/Modals/сhannel-modal";
import { Video } from "@/types/video-type";
import { ChannelType } from "@/types/channel-type";
import { User } from "@supabase/auth-js";

import '@/app/channel/channel-page-styles.css';

type Props = {
    user: User;
    channel: ChannelType;
    videos: Video[];
}

export default function DashboardPage({user, channel, videos} : Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);


    return (
        <div className="channel-page-wrapper">
            <AccountViewController user={user} channel={channel} videos={videos} />
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
                        <VideoGrid videos={videos} isVertical={false}/>
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
