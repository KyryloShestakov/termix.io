"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Video } from "@/types/video-type";
import { User } from "@supabase/auth-js";
import "@/app/video/[id]/styles.css"

type Props = {
    video: Video;
    user: User | null;
};

export default function VideoPage({ video: initialVideo, user }: Props) {
    const [video, setVideo] = useState<Video>(initialVideo);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newComment, setNewComment] = useState("");

    const handleLike = async () => {
        if (!video || !user) return;

        const { error } = await supabase
            .from("likes")
            .insert({ video_id: video.id, user_id: user.id });

        if (!error) {
            setVideo({ ...video, likes_count: video.likes_count + 1 });
        }
    };

    const handleCommentSubmit = async () => {
        if (!video || !newComment.trim() || !user) return;

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

    return (
        <div className="youtube-page">
            <div className="youtube-body">
                <main className="video-layout">
                    <div className="video-content">
                        {video.url ? (
                            <div className="video-player-wrapper">
                                <video className="video-player" src={video.url} controls />
                            </div>
                        ) : (
                            <p>Video not available</p>
                        )}
                        <h1>{video.title}</h1>
                        <p>{video.description}</p>
                        <div>
                            <span>👁 {video.views}</span>
                            <span>👍 {video.likes_count}</span>
                            <button onClick={handleLike}>Like</button>
                        </div>
                        <div>
                            <h3>Comments ({video.comments.length})</h3>
                            <ul>
                                {video.comments.map(c => (
                                    <li key={c.id}>
                                        <b>{c.user_id}:</b> {c.content}
                                    </li>
                                ))}
                            </ul>
                            <input
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button onClick={handleCommentSubmit}>Post</button>
                        </div>
                    </div>
                    <aside className="video-suggestions">
                    <p>Number 1</p>
                    <p>Number 2</p>
                    </aside>
                </main>
            </div>
        </div>
    );
}
