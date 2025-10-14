import getVideos from "@/lib/api/videos";
import PageWrapper from "@/components/Layout/PageWrapper";
import VideoGrid from "@/components/Grid/video-grid";

export default async function Home() {
    const videos = await getVideos();
    return (
        <PageWrapper>
            <VideoGrid videos={videos} />
        </PageWrapper>
    );
}
