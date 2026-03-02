"use client";
import React from "react";

type Props = {
    username: string | null;
    size?: number;
};

export default function AvatarFallback({ username, size = 40 }: Props) {
    const firstLetter = username?.charAt(0).toUpperCase();
    // разобраться с игнором
    // @ts-ignore
    const hash = Array.from(username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    const bgColor = `hsl(${hue}, 60%, 70%)`;

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: bgColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 600,
                fontSize: size * 0.5,
                color: "#fff",
            }}
        >
            {firstLetter}
        </div>
    );
}
