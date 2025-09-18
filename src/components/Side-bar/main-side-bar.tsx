import React from "react";
import "@/components/Side-bar/main-side-bar-styles.css"

export default function MainSideBar() {
    return (
        <aside className="sidebar">
            <nav>
                <a href="/">Home</a>
                <a href="#">Trending</a>
                <a href="#">Subscriptions</a>
                <a href="#">Library</a>
            </nav>
        </aside>
    )
}