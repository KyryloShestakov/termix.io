"use client";
import {useEffect, useState} from "react";
import { getChannelById } from "@/lib/api/channel";
import styles from "./label.module.css"

type ChannelLabelProps = {
    channelId: string;
}

type ChannelIconProps = {
    channelId: string;
    size: number;
}

export default function ChannelLabel({ channelId }: ChannelLabelProps) {
    const [channelName, setChannelName] = useState<string>("Loading...");
    useEffect(() => {
        async function fetchChannel() {
            try {
                const channel = await getChannelById(channelId);
                if (channel?.name) {
                    setChannelName(channel.name);
                } else {
                    setChannelName("Unknown");
                }
            } catch (error) {
                console.error("Channel loading error:", error);
                setChannelName("Download error");
            }
        }

        if (channelId) fetchChannel();
    }, [channelId]);

    return <p>{channelName}</p>;
}

export function ChannelIcon({ channelId, size = 35 }: ChannelIconProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [channelName, setChannelName] = useState<string>("");

    useEffect(() => {
        async function fetchChannel() {
            try {
                const channel = await getChannelById(channelId);
                if (channel) {
                    setChannelName(channel.name || "");
                    setAvatarUrl(channel.avatar_url || null);
                }
            } catch (error) {
                console.error("Channel loading error:", error);
                setAvatarUrl(null);
            }
        }

        if (channelId) fetchChannel();
    }, [channelId]);

    const getRandomColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${hash % 360}, 60%, 50%)`;
    };

    const commonStyle: React.CSSProperties = {
        width: size,
        height: size,
        fontSize: size * 0.45,
    };

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={channelName}
                className={styles.avatar}
                style={commonStyle}
            />
        );
    } else {
        return (
            <div
                className={styles.avatarFallback}
                style={{
                    ...commonStyle,
                    backgroundColor: getRandomColor(channelName),
                }}
            >
                {channelName ? channelName[0].toUpperCase() : "?"}
            </div>
        );
    }
}
