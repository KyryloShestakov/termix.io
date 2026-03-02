'use client'

import {User} from "@supabase/auth-js";
import {Video} from "@/types/video-type";
import {ChannelType} from "@/types/channel-type";
import CreateChannelForm from "@/components/Account/Dashboard/CreateChannelForm";
import VideoGrid from "@/components/Grid/video-grid";
import {countSubscribers} from "@/lib/api/subsriptions";
import {useEffect, useState} from "react";

type ChannelProps = {
    user: User;
    channel: ChannelType | null;
    videos: Video[];
}

export default function Dashboard({user, channel, videos}: ChannelProps){
    const [count, setCount] = useState(0);
    // опять передаю айди держателя канала а не айди канала
    // сделать нормальную подгзрузку данных

    const loadSubscribers = async () => {
        const subscription = await countSubscribers(channel?.owner_id!);

        setCount(subscription);
    };

    useEffect(() => {
        loadSubscribers()
    }, []);

    return(
        <div>
        {!channel ? (
            <CreateChannelForm user={user}/>
        ) : (
            <div>
                <h1>
                    {channel.name} {channel.is_private === false ? "(Public)" : "(Private)"}
                </h1>
                <h4 style={{
                    padding: "1px 2px",
                    fontWeight: "400",
                    color: "#cccccc"
                }}>
                    Subscribers: {count}
                </h4>
                <VideoGrid videos={videos} isVertical={false}/>
            </div>
        )}
        </div>
    )
}