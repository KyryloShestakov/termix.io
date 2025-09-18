"use client";
import Link from "next/link";
import "./video-grid.css"
import {supabase} from "@/lib/supabase";

type Video = {
    id: string;
    title: string;
    description: string;
    file_path: string;
    is_private: boolean;
    url: string | null;
    [key: string]: any;
    views?: number;
};


type Props = {
    videos: Video[];
};

export default function VideoGrid({ videos }: Props) {
    if (!videos || videos.length === 0) {
        return <p>No videos available.</p>;
    }

    const handleVideoClick = async (videoId: string) => {
        const { error } = await supabase.rpc("increment_views", { video_id: videoId });
        if (error) console.error("Error updating views:", error);
    };

    return (
        <main className="video-grid">
            {videos.map((video) => (
                <Link key={video.id} className={"link-card"} href={`/video/${video.id}`} onClick={() => handleVideoClick(video.id)}>
                        <div className="video-card">
                            {video.url ? (
                                <video controls src={video.url}>
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p>Video not available</p>
                            )}
                            <div className="thumbnail">Thumbnail</div>
                            <div className="video-info">
                                <div>
                                    <h3>{video.title}</h3>
                                    <p>{video.description}</p>
                                </div>
                                <div>
                                    <p>Views: {video.views || 0}</p>
                                </div>
                            </div>
                        </div>
                </Link>
                ))}
        </main>
    );
}
