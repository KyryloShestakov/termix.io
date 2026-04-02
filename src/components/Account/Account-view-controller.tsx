'use client'
import React, {useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {Video, ChannelType} from "@/types"
import styles from "./account.module.css";
import Settings from "@/components/Account/Settings/Settings";
import Analytics from "@/components/Account/Analytics/Analytics";
import Studio from "@/components/Account/Studio/Studio";
import Profile from "@/components/Account/Profile/Profile";
import {usePathname} from "next/navigation";
import Dashboard from "@/components/Account/Dashboard/Dashboard";

type ChannelSideBarProps = {
    user: User;
    channel: ChannelType | null;
    videos: Video[];
}

export default function AccountViewController({user, channel, videos}: ChannelSideBarProps) {
    const [active, setActive] = useState<"dashboard" | "profile" | "settings" | "analytics" | "studio">("dashboard");
    const pathname = usePathname();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeAccountTab");
        if (savedTab) {
            setActive(savedTab as any);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("activeAccountTab", active);
    }, [active]);

    useEffect(() => {
        setActive("dashboard");
    }, [pathname]);

    const renderContent = () => {
        switch (active) {
            case "dashboard":
                return <Dashboard user={user} channel={channel} videos={videos}/>;
            case "profile":
                return <Profile user={user}/>;
            case "settings":
                return <Settings/>;
            case "analytics":
                return <Analytics channel={channel}/>;
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
                    {["dashboard", "profile" , "settings", "analytics", "studio"].map((tab) => (
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

            <main className={styles.main}>
                {renderContent()}
            </main>
        </div>
    )
}