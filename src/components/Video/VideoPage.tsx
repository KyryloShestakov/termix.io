"use client";
import React, { useState } from "react";
import { Video } from "@/types/video-type";
import { User } from "@supabase/auth-js";
import styles from "./video-page.module.css";
import VideoGrid from "@/components/Grid/video-grid";
import { ChannelType, ProfileType } from "@/types";
import { addComment, deleteComment, editComment, toggleLike } from "@/lib/api/actions";
import VideoInfoChannel from "@/components/Video/Video-info-channel";

type Props = {
    video: Video;
    videos: Video[];
    user: User | null;
    profile: ProfileType | null;
    subscription: number;
    channel: ChannelType | null;
};

export default function VideoPage({ video: initialVideo, videos, user, profile, subscription, channel }: Props) {
    const [video, setVideo] = useState<Video>(initialVideo);
    const [newComment, setNewComment] = useState("");

    const handleLike = async () => {
        if (!video || !user) return;
        const updatedVideo = await toggleLike({ video, user });
        if (updatedVideo) setVideo(updatedVideo);
    };

    const handleCommentSubmit = async () => {
        if (!video || !newComment.trim() || !user) return;
        // @ts-ignore
        const updatedVideo = await addComment({ video, user, comment: newComment, profile });
        if (updatedVideo) {
            setVideo(updatedVideo);
            setNewComment("");
        }
    };

    const handleCommentEdit = async (commentId: string, newContent: string) => {
        // @ts-ignore
        const updatedVideo = await editComment({ video, user, commentId, comment: newContent });
        if (updatedVideo) setVideo(updatedVideo);
    };

    const handleCommentDelete = async (commentId: string) => {
        // @ts-ignore
        const updatedVideo = await deleteComment({ video, user, commentId });
        if (updatedVideo) setVideo(updatedVideo);
    };

    return (
        <div className={styles.youtubePage}>
            <div className={styles.youtubeBody}>
                <main className={styles.videoLayout}>
                    <div className={styles.videoContent}>
                        {video.url ? (
                            <div className={styles.videoPlayerWrapper}>
                                <video className={styles.videoPlayer} src={video.url} controls />
                            </div>
                        ) : (
                            <p>Video not available</p>
                        )}
                        <h3>{video.title}</h3>

                          <VideoInfoChannel channel={channel} subscription={subscription} user={user} />

                        <p>{video.description}</p>
                        <div>
                            <span>👁 {video.views}</span>
                            <span>👍 {video.likes_count}</span>
                            <button onClick={handleLike}>Like</button>
                        </div>

                        <div>
                            <h3>Comments ({video.comments.length})</h3>
                            <input
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                            />
                            <button onClick={handleCommentSubmit}>Post</button>
                            <ul>
                                {video.comments.map(c => (
                                    <li key={c.id} style={{
                                        marginBottom: "0.5rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem"
                                    }}>
                                        <span>
                                            <b>{c.userName}:</b> {c.content}
                                        </span>
                                        {user?.id === c.user_id && (<span style={{display: "flex", gap: "0.25rem"}}>
                                <button
                                    onClick={() => {
                                        const newText = prompt("Edit comment:", c.content);
                                        if (newText !== null) handleCommentEdit(c.id, newText);
                                    }}
                                    style={{
                                        padding: "2px 6px",
                                        fontSize: "0.75rem",
                                        cursor: "pointer",
                                        borderRadius: "4px"
                                    }}
                                >
                                Edit
                                </button>
                                <button onClick={() => handleCommentDelete(c.id)}
                                        style={{
                                            padding: "2px 6px",
                                            fontSize: "0.75rem",
                                            cursor: "pointer",
                                            borderRadius: "4px",
                                            color: "white"
                                        }}
                                >
                                Delete
                                </button>

                                </span>
                                        )}
                                        <span style={{marginLeft: "0.5rem", fontSize: "0.75rem", color: "#666"}}>
                                        {new Date(c.created_at).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <aside className={styles.videoSuggestions}>
                        <VideoGrid videos={videos} isVertical={false}/>
                    </aside>
                </main>
            </div>
        </div>
    );
}
