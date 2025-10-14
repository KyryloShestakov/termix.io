import "./styles.css"
import getVideos from "@/lib/api/videos";
import getUser from "@/lib/api/user";
import PageWrapper from "@/components/Layout/PageWrapper";
import VideoPage from "@/components/VideoPage";

type Props = {
    params: { id: string | string[] };
};

export default async function Page({params} : Props) {

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const user = await getUser();
    const video = await getVideos(undefined, id)

    if (!video) return <p>Loading...</p>;

    return (
        <PageWrapper>
            <VideoPage video={video[0]} user={user.user}/>
        </PageWrapper>
    )

}
