"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import styles from "@/components/Modals/channel.module.css";

type ChannelModalProps = {
    isOpen: boolean;
    // @ts-ignore
    onClose: () => void;
    userId: string | null;
};

export default function ChannelModal({ isOpen, onClose, userId }: ChannelModalProps) {
    const [name, setName] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!userId) return;
        const { error } = await supabase.from("channels").insert([
            { name, is_private: isPrivate, owner_id: userId },
        ]);
        if (error) console.error(error);
        else {
            setName("");
            setIsPrivate(true);
            onClose();
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.channelModalOverlay} onClick={handleOverlayClick}>
            <div className={styles.channelModalContainer}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
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
                <button className={styles.createBtn} onClick={handleCreate}>
                    Create
                </button>
            </div>
        </div>
    );
}
