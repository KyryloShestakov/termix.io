"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header/Header";
import MainSideBar from "@/components/Side-bar/main-side-bar";
import "./styles.css"
import FetchVideos from "@/components/Videos/get-videos";
import useUser from "@/components/Fetch/use-user";

type Comment = {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
};

type Video = {
    id: string;
    title: string;
    description: string;
    file_path: string;
    is_private: boolean;
    url: string | null;
    likes_count: number;
    comments: Comment[];
    views?: number;
    [key: string]: any;
};

export default function VideoPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [video, setVideo] = useState<Video | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");
    const user = useUser();

    useEffect(() => {
        if (!id) return;

        const loadVideo = async () => {
            const vids = await FetchVideos(undefined, id);
            setVideo(vids[0] || null);
        };
        loadVideo();
    }, [id]);

    const handleLike = async () => {
        if (!video) return;

        const { error } = await supabase
            .from("likes")
            .insert({ video_id: video.id, user_id: user.id });

        if (!error) {
            setVideo({ ...video, likes_count: video.likes_count + 1 });
        }
    };

    const handleCommentSubmit = async () => {
        if (!video || !newComment.trim()) return;

        const { data, error } = await supabase
            .from("comments")
            .insert({ video_id: video.id, user_id: user.id, content: newComment })
            .select()
            .single();

        if (!error && data) {
            setVideo({ ...video, comments: [...video.comments, data] });
            setNewComment("");
        }
    };

    if (!video) return <p>Loading...</p>;

    return (
        <div className="youtube-page">
            <Header onOpenAuthModal={() => setIsModalOpen(true)}/>
            <div className="youtube-body">
                <MainSideBar/>
                <main className="video-layout">
                    <div className="video-content">
                        <div className="video-player-wrapper">
                            {video.url ? (
                                <video className="video-player" controls src={video.url}></video>
                            ) : (
                                <p>Video not available</p>
                            )}
                        </div>
                        <h1 className="video-title">{video.title}</h1>
                        <p className="video-description">{video.description}</p>

                        <div className="video-stats">
                            <span>👁 {video.views}</span>
                            <span>👍 {video.likes_count}</span>
                            <button onClick={handleLike}>Like</button>
                        </div>

                        <div className="comments-section">
                            <h3>Comments ({video.comments.length})</h3>
                            <ul>
                                {video.comments.map((c) => (
                                    <li key={c.id}>
                                        <b>{c.user_id}:</b> {c.content} //TODO
                                    </li>
                                ))}
                            </ul>
                            <div className="add-comment">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                />
                                <button onClick={handleCommentSubmit}>Post</button>
                            </div>
                        </div>
                    </div>

                    <aside className="video-suggestions">
                        <h3>Recommended</h3>
                        <div className="suggestion-card">Video 1</div>
                        <div className="suggestion-card">Video 2</div>
                        <div className="suggestion-card">Video 3</div>
                    </aside>
                </main>
            </div>
        </div>

    );
}
