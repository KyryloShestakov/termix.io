import React, {useEffect, useState} from "react";
import {ChannelIcon} from "@/components/Grid/channelLabel";
import {ChannelType} from "@/types";
import {User} from "@supabase/auth-js";
import styles from "./video-page.module.css";
import {getSubscription, subscribe, unsubscribe} from "@/lib/api/subsriptions";
import Link from "next/link";

type Props = {
    channel: ChannelType | null;
    subscription: number;
    user: User | null;
};

export default function VideoInfoChannel({channel, subscription, user}: Props) {

    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [subscriptionCount, setSubscriptionCount] = useState(subscription);

    useEffect(() => {
        if (!user || !channel) return;

        async function check() {
            try {
                // @ts-ignore
                const isSubscribed = await getSubscription(user.id, channel.owner_id);
                setSubscribed(!!isSubscribed);
            } catch (err) {
                console.error(err);
            }
        }
        check();
    }, [user, channel]);

    const handleSubscribe = async () => {
        if (!user || !channel) return;

        setLoading(true);
        try {
            if (subscribed) {
                const ok = await unsubscribe(user.id, channel.owner_id);
                if (ok) {
                    setSubscribed(false);
                    setSubscriptionCount(c => Math.max(c - 1, 0));
                }
            } else {
                const ok = await subscribe(user.id, channel.owner_id);
                if (ok) {
                    setSubscribed(true);
                    setSubscriptionCount(c => c + 1);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (channel)
    return (
        <div className={styles.wrapper}>
            <div className={styles.left}>
                <div className={styles.avatar}>
                    <Link href={`/channel/${channel.id}`}>
                <ChannelIcon channelId={channel.id} size={48} />
                </Link>
                </div>
                <div className={styles.meta}>
                    <div className={styles.name}>{channel.name}</div>
                    <div className={styles.subscribers}>{subscriptionCount} subscribers</div>
                </div>

                <button
                    className={`${styles.subscribeBtn} ${subscribed ? styles.subscribed : ""}`}
                    onClick={handleSubscribe}
                    disabled={loading}
                >
                    {loading ? "..." : subscribed ? "Subscribed" : "Subscribe"}
                </button>
            </div>


        </div>
    );
}
