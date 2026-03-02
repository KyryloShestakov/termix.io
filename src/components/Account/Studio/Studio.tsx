"use client"

import {ChannelType} from "@/types";
import {User} from "@supabase/auth-js";
import {useState} from "react";
import styles from "@/components/Account/Studio/Studio.module.css";
import UploadVideoForm from "@/components/Account/Studio/UploadVideoForm";
import VideoService from "@/lib/services/VideoService";

type StudioProps = {
    channel: ChannelType | null;
    user: User;
}

export default function Studio({channel, user}: StudioProps){
    const [loading, setLoading] = useState(false);

    const videoService = new VideoService();

    const handleUpload = async (data: { file: File; title: string; description: string; isPrivate: boolean; }) => {
        if (!user || !channel) {
            alert("User or channel not loaded yet");
            return;
        }

        try {
            setLoading(true);
            const { video, url, error } = await videoService.uploadVideo(
                data.file,
                user.id,
                channel.id,
                data.title,
                data.description,
                data.isPrivate
            );

            if (error) {
                alert("Error uploading video");
                return;
            }

            alert("Video uploaded successfully!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className={styles.studioPage}>
            <div className={styles.studioPageWrapper}>
                <main className={styles.studioMain}>
                    <h1>Upload a New Video</h1>
                    {!channel ? (
                        <p>You don't have a channel yet. Please create one first.</p>
                    ) : (
                        <UploadVideoForm onSubmit={handleUpload} loading={loading}/>
                    )}
                </main>
            </div>
        </div>
    )
}