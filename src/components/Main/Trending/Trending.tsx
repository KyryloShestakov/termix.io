import {Video} from "@/types";
import {getTrendingVideos} from "@/lib/api/videos";
import VideoGrid from "@/components/Grid/video-grid";

type Props = {
    video: Video[] | null ;
}

export default function Trending({video}: Props) {
    const trending = getTrendingVideos(video);
    return (
        <div>
            <h1>Trending page</h1>
            <VideoGrid videos={trending} isVertical={false} />
        </div>
    )
}