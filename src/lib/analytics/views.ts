import VideoService from "@/lib/services/VideoService";

export async function getViews(channelId: string) {
    try {
        const videoService = new VideoService();
        const videos = await videoService.getVideos(channelId);
        const totalViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);
        return totalViews;
    } catch (err) {
        console.error("Error getting views:", err);
        return 0;
    }
}
