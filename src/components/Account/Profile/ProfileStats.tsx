import React from "react";
import { User } from "@supabase/auth-js";
import styles from "./Profile.module.css";

type Props = { user: User };

export default function ProfileStats({ user }: Props) {
    return (
        <div className={styles.stats}>
            {/*<div>*/}
            {/*    <strong>{user.total_videos || 0}</strong>*/}
            {/*    <span>Videos</span>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <strong>{user.total_subscribers || 0}</strong>*/}
            {/*    <span>Subscribers</span>*/}
            {/*</div>*/}
            {/*<div>*/}
            {/*    <strong>{user.total_views || 0}</strong>*/}
            {/*    <span>Views</span>*/}
            {/*</div>*/}
        </div>
    );
}
