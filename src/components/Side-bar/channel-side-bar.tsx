import React from "react";
import "@/components/Side-bar/main-side-bar-styles.css"

export default function ChannelSideBar() {
    return (
        <aside className="sidebar">
            <nav>
                <a href={"/channel"}>Dashboard</a>
                <a href={"#"}>Settings</a>
                <a href={"#"}>Analytics</a>
                <a href={"/channel/studio"}>Studio</a>
            </nav>
        </aside>
    )
}