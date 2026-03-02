import { ChannelType, Video } from "@/types";
import VideoGrid from "@/components/Grid/video-grid";
import styles from "@/components/Channel/channel.module.css";
import AvatarFallback from "@/components/AvatarFallback";
import React from "react";

type ChannelPageProps = {
    channel: ChannelType | null;
    videos: Video[];
    subscription: number;
};

export default function ChannelPage({ channel, videos, subscription }: ChannelPageProps) {
    return (
        <div className={styles.page}>
            <div className={styles.banner} />

            <div className={styles.header}>
                <div className={styles.avatarWrapper}>
                    {channel?.avatar_url ? (
                        <img
                            src={channel.avatar_url}
                            alt={channel.username}
                            className={styles.avatar}
                        />
                    ) : (
                        <AvatarFallback username={channel?.name as string} size={120}/>
                    )}
                </div>

                <div className={styles.channelInfo}>
                    <div className={styles.channelName}>{channel?.name}</div>
                    <div className={styles.channelMeta}>
                        {subscription || 0} subscribers • {videos.length} videos
                    </div>
                    <button className={styles.subscribeButton}>Subscribe</button>
                </div>

                {/*<div className={styles.subscribeWrapper}>*/}
                {/*<button className={styles.subscribeButton}>Subscribe</button>*/}
                {/*</div>*/}
            </div>

            <div className={styles.navbar}>
                <button className={styles.navItemActive}>Videos</button>
                <button className={styles.navItem}>Home</button>
                <button className={styles.navItem}>Playlists</button>
                <button className={styles.navItem}>About</button>
            </div>

            <div className={styles.content}>
                <VideoGrid videos={videos} isVertical={false}/>
            </div>
        </div>
    );
}
