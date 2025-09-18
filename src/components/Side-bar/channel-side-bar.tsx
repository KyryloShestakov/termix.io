import React from "react";
import "@/components/Side-bar/channel-side-bar-styles.css"

export default function ChannelSideBar() {
    return (
        <aside className="sidebar">
            <ul>
                <a href={"/channel"}><li>Dashboard</li></a>
                <li>Settings</li>
                <li>Analytics</li>
                <a href={"/channel/studio"}>
                    <li>Studio</li>
                </a>
            </ul>
        </aside>
    )
}