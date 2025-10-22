import "./styles.css"
import getVideos from "@/lib/api/videos";
import PageWrapper from "@/components/Layout/PageWrapper";
import VideoPage from "@/components/VideoPage";
import getUser from "@/lib/api/user";
type Props = {
    params: { id: string | string[] };
};

export default async function Page({params} : Props) {
    const paramsData = await params;
    const id = Array.isArray(paramsData.id) ? paramsData.id[0] : paramsData.id;
    const user = await getUser();
    const video = await getVideos(undefined, id)
    if (!video) return <p>Loading...</p>;

    return (
        <PageWrapper>
            <VideoPage video={video[0]} user={user.user}/>
        </PageWrapper>
    )

}
