'use client';

import React, { useState } from "react";
import styles from "./Studio.module.css";

type UploadVideoFormProps = {
    onSubmit: (data: {
        file: File;
        title: string;
        description: string;
        isPrivate: boolean;
    }) => void;
    loading?: boolean;
};

export default function UploadVideoForm({ onSubmit, loading }: UploadVideoFormProps) {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile) return alert("Please select a video file");

        onSubmit({
            file: videoFile,
            title: videoTitle,
            description: videoDescription,
            isPrivate,
        });

        setVideoFile(null);
        setVideoTitle("");
        setVideoDescription("");
        setIsPrivate(false);
    };

    return (
        <form className={styles.uploadForm} onSubmit={handleSubmit}>
            <label>
                Video File
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    required
                />
            </label>

            <label>
                Title
                <input
                    type="text"
                    placeholder="Video Title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    required
                />
            </label>

            <label>
                Description
                <textarea
                    placeholder="Video Description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    rows={4}
                    required
                />
            </label>

            <label className={styles.privacyLabel}>
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
                Private Video
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Uploading..." : "Upload Video"}
            </button>
        </form>
    );
}
