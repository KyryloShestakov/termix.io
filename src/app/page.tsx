import getVideos from "@/lib/api/videos";
import PageWrapper from "@/components/Layout/PageWrapper";
import VideoGrid from "@/components/Grid/video-grid";
import getUser from "@/lib/api/user";

export default async function Home() {
    const videos = await getVideos();
    const user = await getUser();
    console.log(user?.id);

    return (
        <PageWrapper>
            <VideoGrid videos={videos} />
        </PageWrapper>
    );
}
