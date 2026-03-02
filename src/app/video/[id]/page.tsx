import "./styles.css"
import PageWrapper from "@/components/Layout/PageWrapper";
import VideoPage from "@/components/Video/VideoPage";
import getUser from "@/lib/api/user";
import {countSubscribers} from "@/lib/api/subsriptions";
import {getChannelById} from "@/lib/api/channel";
import VideoService from "@/lib/services/VideoService";
import {profileService} from "@/lib/services";

type Props = {
    params: { id: string | string[] };
};

//сделать баличек для упаковки всех данных
export default async function Page({params} : Props) {
    const videoService = new VideoService();

    const paramsData = await params;
    const id = Array.isArray(paramsData.id) ? paramsData.id[0] : paramsData.id;

    const user = await getUser();
    const video = await videoService.getVideos(undefined,id)
    const channel = await getChannelById(video[0].channel_id);
    const subscription = await countSubscribers(channel?.owner_id!);
    const videos = await videoService.getVideos();
    const profile = await profileService.getById(user.id);

    if (!video) return <p>Loading...</p>;

    return (
        <PageWrapper user={user}>
            <VideoPage video={video[0]}
                       videos={videos.filter(v => v.id !== video[0].id && !v.is_private)}
                       user={user}
                       profile={profile}
                       subscription={subscription}
                       channel={channel}/>
        </PageWrapper>
    )

}
