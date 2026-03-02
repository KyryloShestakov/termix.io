'use server'

import PageWrapper from "@/components/Layout/PageWrapper";
import getUser from "@/lib/api/user";
import AccountViewController from "@/components/Account/Account-view-controller";
import getChannel from "@/lib/api/channel";
import VideoService from "@/lib/services/VideoService";
import {countSubscribers} from "@/lib/api/subsriptions";

export default async function Account() {
    const videoService = new VideoService;
    const user = await getUser();
    const [channel] = await Promise.all([
        getChannel(user.id),
    ]);

    const videos = await videoService.getVideos(channel?.id);

    return (
        <PageWrapper user={user}>
            <AccountViewController
                user={user}
                channel={channel}
                videos={videos}
            />
        </PageWrapper>
    );
}
