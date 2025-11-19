'use client'
import React, {useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {Video, ChannelType} from "@/types"
import styles from "./Main.module.css";
import VideoGrid from "@/components/Grid/video-grid";
import {redirect, usePathname} from "next/navigation";
import Trending from "@/components/Main/Trending/Trending";
import Subscriptions from "@/components/Main/Subscriptions/Subscriptions";

type Props = {
    user: User | null;
    // channel: ChannelType | null;
    videos: Video[];
}

export default function MainViewController({user, videos = [] }: Props) {
    const [active, setActive] = useState<"home" | "trending" | "communities" | "subscriptions" | "library">("home");
    const pathname = usePathname();

    useEffect(() => {
        const savedTab = localStorage.getItem("activeMainTab");
        if (savedTab) {
            setActive(savedTab as any);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("activeMainTab", active);
    }, [active]);

    //TODO При перезагрузки возврощает на хоум
    useEffect(() => {
        setActive("home");
    }, [pathname]);

    const renderContent = () => {
        switch (active) {
            case "home":
                return <VideoGrid videos={videos.filter(video => video.is_private === false)}/>;
            case "trending":
                return <Trending video={videos.filter(video => video.is_private === false)}/>
            case "communities":
                return <div>Communites</div>
            case "subscriptions":
                if (user)
                    return <Subscriptions user={user}/>
                else redirect("/auth/auth-error");
            default:
                return null;
        }
    };

    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <aside className={styles.sidebar}>
                <nav>
                    {["home", "trending", "communities", "subscriptions", "library"].map((tab) => {
                        if (tab === "subscriptions" && !user) return null;
                        if (tab === "library" && !user) return null;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActive(tab as any)}
                                className={`${styles.navButton} ${active === tab ? styles.active : ""}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        );
                    })}
                </nav>
            </aside>


            <main className={styles.main}>
                {renderContent()}
            </main>
        </div>
    )
}