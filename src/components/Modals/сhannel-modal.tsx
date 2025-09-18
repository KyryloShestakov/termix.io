"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import "./channel-modal-styles.css";

type ChannelModalProps = {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
};

export default function ChannelModal({ isOpen, onClose, userId }: ChannelModalProps) {
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!userId) return;
        const { data, error } = await supabase.from("channels").insert([
            { name, is_private: isPrivate, owner_id: userId }
        ]);
        if (error) console.log(error);
        else {
            setName("");
            setIsPrivate(true);
            onClose();
        }
    };

    return (
        <div className="channel-modal-overlay">
            <div className="channel-modal-container">
                <button className="close-btn" onClick={onClose}>✕</button>
                <h2>Create Channel</h2>
                <input
                    type="text"
                    placeholder="Channel Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    Private
                </label>
                <button className="create-btn" onClick={handleCreate}>
                    Create
                </button>
            </div>
        </div>
    );
}
