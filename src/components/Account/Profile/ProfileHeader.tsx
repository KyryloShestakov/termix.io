import React from "react";
import styles from "./Profile.module.css";
import {ProfileType} from "@/types";
import {User} from "@supabase/auth-js";
import AvatarFallback from "@/components/AvatarFallback";

type Props = {
    user: User;
    profile: ProfileType
};

export default function ProfileHeader({ user, profile }: Props) {
    if(user)
    return (
        <div className={styles.header}>
            {profile.avatar_url ? (
                <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className={styles.avatar}
                />
            ) : (
                <AvatarFallback username={profile.username} size={80}/>
            )}
            <div>
                <h1 className={styles.username}>{profile.username}</h1>
                <p className={styles.bio}>{profile.bio || "No bio yet"}</p>
            </div>
        </div>
    );
}
