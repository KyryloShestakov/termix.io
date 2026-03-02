import {Video} from "@/types/video-type"

export function getTrendingVideos(videos: Video[] | null, now: Date = new Date()): Video[] {
    if (!videos || videos.length === 0) return [];
    const scoredVideos = videos.map(video => {
        const views = video.views || 0;
        const likes = video.likes_count || 0;
        const comments = video.comments?.length || 0;

        const hoursSinceUpload = (now.getTime() - new Date(video.created_at).getTime()) / 3600000;

        const score = (views + likes * 2 + comments * 3) / Math.pow(hoursSinceUpload + 2, 1.5);

        return { ...video, score };
    });

    return scoredVideos.sort((a, b) => (b as any).score - (a as any).score);
}