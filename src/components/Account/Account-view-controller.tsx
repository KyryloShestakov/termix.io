'use client'
import React, {useState} from "react";
import {User} from "@supabase/auth-js";
import {Video, ChannelType} from "@/types"
import Channel from "@/components/Account/Channel/Channel";
import styles from "./account.module.css";
import Settings from "@/components/Account/Settings/Settings";
import Analytics from "@/components/Account/Analytics/Analytics";
import Studio from "@/components/Account/Studio/Studio";

type ChannelSideBarProps = {
    user: User;
    channel: ChannelType | null;
    videos: Video[];
}

export default function AccountViewController({user, channel, videos}: ChannelSideBarProps) {
    const [active, setActive] = useState<"dashboard" | "settings" | "analytics" | "studio">("dashboard");
    const renderContent = () => {
        switch (active) {
            case "dashboard":
                return <Channel user={user} channel={channel} videos={videos}/>;
            case "settings":
                return <Settings/>;
            case "analytics":
                return <Analytics/>;
            case "studio":
                return <Studio user={user} channel={channel}/>;
            default:
                return null;
        }
    };

    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <aside className={styles.sidebar}>
                <nav>
                    {["dashboard", "settings", "analytics", "studio"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActive(tab as any)}
                            className={`${styles.navButton} ${active === tab ? styles.active : ""}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </aside>

            <main style={{flex: 1, padding: "1.5rem"}}>
                {renderContent()}
            </main>
        </div>
    )
}