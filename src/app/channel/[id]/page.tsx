import PageWrapper from "@/components/Layout/PageWrapper";
import {loadPageData} from "@/lib/loaders/load-page-data";
import {getChannelById} from "@/lib/api/channel";
import ChannelPage from "@/components/Channel/ChannelPage";
import {videoService} from "@/lib/services";
import {countSubscribers} from "@/lib/api/subsriptions";

type Props = {
    params: { id: string | string[] };
};

export default async function Channel({params}: Props) {
    const data = await loadPageData()
    const paramsData = await params;
    const id = Array.isArray(paramsData.id) ? paramsData.id[0] : paramsData.id;

    const channel = await getChannelById(id);
    const videos = await videoService.getVideos(channel?.id);
    const subscription = await countSubscribers(channel?.owner_id!);
    return (
        <PageWrapper user={data?.user}>
          <ChannelPage channel={channel} videos={videos.filter(v => v.id && !v.is_private)} subscription={subscription}></ChannelPage>
        </PageWrapper>
    )
}