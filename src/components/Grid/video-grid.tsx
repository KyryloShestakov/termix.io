"use client";

import Link from "next/link";
import styles from "./video-grid.module.css";
import { supabase } from "@/utils/supabase/supabase";
import { Video } from "@/types/video-type";
import ChannelLabel, { ChannelIcon } from "@/components/Grid/channelLabel";
import { timeAgo } from "@/utils/timeAgo";
import { useState } from "react";

type Props = {
    videos: Video[];
    isVertical: boolean;
};

export default function VideoGrid({ videos }: Props) {
    const [menuData, setMenuData] = useState<{
        video: Video;
        x: number;
        y: number;
    } | null>(null);

    const handleVideoClick = async (videoId: string) => {
        const { error } = await supabase.rpc("increment_views", { video_id: videoId });
        if (error) console.error("Error updating views:", error);
    };

    const handleMoreClick = (e: React.MouseEvent, video: Video) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setMenuData({ video, x: rect.left, y: rect.bottom });
    };

    const closeMenu = () => setMenuData(null);

    if (!videos || videos.length === 0) {
        return <p className={styles.noVideos}>No videos available.</p>;
    }

    return (
        <>
            <main className={styles.videoGrid}>
                {videos.map((video) => (
                    <Link
                        key={video.id}
                        href={`/video/${video.id}`}
                        className={styles.linkCard}
                        onClick={() => handleVideoClick(video.id)}
                    >
                        <div className={styles.videoCard}>
                            {video.url ? (
                                <video className={styles.videoThumbnail} controls src={video.url} />
                            ) : (
                                <div className={styles.thumbnailFallback}>Video not available</div>
                            )}

                            <div className={styles.videoInfo}>
                                <div className={styles.channelIcon}>
                                    <ChannelIcon channelId={video.channel_id} size={35}/>
                                </div>

                                <div className={styles.videoMeta}>
                                    <div className={styles.titleRow}>
                                        <h3 className={styles.videoTitle}>{video.title}</h3>
                                        <button
                                            className={styles.moreBtn}
                                            onClick={(e) => handleMoreClick(e, video)}
                                        >
                                            &#x22EE;
                                        </button>
                                    </div>

                                    <div className={styles.bottomInfo}>
                                        <ChannelLabel channelId={video.channel_id}/>
                                        <span className={styles.meta}>
                                         {video.views || 0} views · {timeAgo(video.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </main>

            {menuData && (
                <div className={styles.menuOverlay} onClick={closeMenu}>
                    <div
                        className={styles.menuContent}
                        style={{ top: menuData.y + window.scrollY, left: menuData.x }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className={styles.menuBtn}>Add to Playlist</button>
                        <button className={styles.menuBtn}>Download</button>
                    </div>
                </div>
            )}
        </>
    );
}
