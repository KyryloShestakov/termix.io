"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/supabase";
import styles from "@/components/Account/account.module.css";
import { User } from "@supabase/auth-js";

type CreateChannelFormProps = {
    user: User;
};

export default function CreateChannelForm({ user }: CreateChannelFormProps) {
    const [channel, setChannel] = useState("");
    const [isPrivate, setIsPrivate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id || !channel.trim()) return;

        setLoading(true);
        setMessage(null);

        try {
            const { data, error } = await supabase
                .from("channels")
                .insert([
                    {
                        name: channel.trim(),
                        is_private: isPrivate,
                        owner_id: user.id,
                    },
                ])
                .select(); // получить созданную запись обратно

            if (error) {
                console.error("Supabase insert error:", error.message);
                setMessage(`Error: ${error.message}`);
            } else {
                console.log("Channel created:", data);
                setMessage("Channel created successfully!");
                setChannel("");
                setIsPrivate(true);
            }
        } catch (err: any) {
            console.error("Unexpected error:", err);
            setMessage("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCreate} className={styles.form}>
            <label htmlFor="name">Create a channel</label>

            <input
                id="name"
                name="name"
                placeholder="Channel Name"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                disabled={loading}
            />

            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    disabled={loading}
                />
                Private
            </label>

            <button
                type="submit"
                className={styles.createBtn}
                disabled={loading || !channel.trim()}
            >
                {loading ? "Creating..." : "Create"}
            </button>

            {message && (
                <p
                    style={{
                        marginTop: "0.75rem",
                        color: message.startsWith("Error") ? "#f87171" : "#22c55e",
                        fontWeight: 500,
                    }}
                >
                    {message}
                </p>
            )}
        </form>
    );
}
