"use client";
import React, { useEffect, useState } from "react";
import ChannelSideBar from "@/components/Side-bar/channel-side-bar";
import Header from "@/components/Header/Header";
import "./studio-styles.css";
import { supabase } from "@/utils/supabase/supabase";
import { uploadVideo } from "@/components/Uploaders/UploadVideo";

export default function StudioPage() {
    const [videoTitle, setVideoTitle] = useState("");
    const [videoDescription, setVideoDescription] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [channel, setChannel] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) setUser(data.user);
            setLoading(false);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchChannel = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from("channels")
                .select("*")
                .eq("owner_id", user.id)
                .single();
            if (error) console.log(error);
            else setChannel(data);
        };
        fetchChannel();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoFile || !user || !channel) {
            alert("User, channel, or file not loaded yet");
            return;
        }

        const { error } = await uploadVideo(
            videoFile,
            user.id,
            channel.id,
            videoTitle,
            videoDescription,
            isPrivate
        );

        if (error) {
            alert("Error uploading video");
            return;
        }

        alert("Video uploaded successfully!");
        setVideoFile(null);
        setVideoTitle("");
        setVideoDescription("");
        setIsPrivate(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="studio-page">
            <Header onOpenAuthModal={() => {}} user={user} />

            <div className="studio-page-wrapper">
                <ChannelSideBar />

                <main className="studio-main">
                    <h1>Upload a New Video</h1>
                    {!channel ? (
                        <p>You don't have a channel yet. Please create one first.</p>
                    ) : (
                        <form className="upload-form" onSubmit={handleSubmit}>
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

                            <label className="privacy-label">
                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                Private Video
                            </label>

                            <button type="submit" className="submit-btn">
                                Upload Video
                            </button>
                        </form>
                    )}
                </main>
            </div>
        </div>
    );
}
