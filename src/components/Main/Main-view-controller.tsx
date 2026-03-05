'use client'
import React, {useEffect, useState} from "react";
import {User} from "@supabase/auth-js";
import {Video} from "@/types"
import styles from "./Main.module.css";
import VideoGrid from "@/components/Grid/video-grid";
import {redirect} from "next/navigation";
import Trending from "@/components/Main/Trending/Trending";
import Subscriptions from "@/components/Main/Subscriptions/Subscriptions";

type Props = {
    user: User | null;
    videos: Video[];
}

export default function MainViewController({user, videos = [] }: Props) {
    const [active, setActive] = useState<"home" | "trending" | "communities" | "subscriptions" | "library">(() => {
        if (typeof window !== "undefined") {
            return (localStorage.getItem("activeMainTab") as any) || "home";
        }
        return "home";
    });

    useEffect(() => {
        localStorage.setItem("activeMainTab", active);
    }, [active]);

    //сделать комьюнити

    const renderContent = () => {
        switch (active) {
            case "home":
                return <VideoGrid videos={videos.filter(video => !video.is_private)} isVertical={false} />;
            case "trending":
                return <Trending video={videos.filter(video => !video.is_private)}/>
            case "communities":
                return <div>Communites</div>
            case "subscriptions":
                if (user)
                    return <Subscriptions user={user}/>
                else redirect("/auth/auth-error");
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