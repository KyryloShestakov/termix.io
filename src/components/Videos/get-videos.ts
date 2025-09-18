import { supabase } from "@/lib/supabase";

type Comment = {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
};

type VideoWithUrl = {
    id: string;
    title: string;
    description: string;
    file_path: string;
    is_private: boolean;
    url: string | null;
    likes_count: number;
    comments: Comment[];
    views?: number;
    [key: string]: any;
};


export default async function FetchVideos(channelId?: string, videoId?: string): Promise<VideoWithUrl[]> {
    let query = supabase
        .from("videos")
        .select(`
            *,
            likes:likes(id),      
            comments:comments(*)
        `)
        .order("created_at", { ascending: false });

    if (channelId) query = query.eq("channel_id", channelId);
    if (videoId) query = query.eq("id", videoId);

    const { data: videos, error } = await query;

    if (error || !videos) {
        console.error("Error fetching videos:", error);
        return [];
    }

    const videosWithUrls: VideoWithUrl[] = videos.map((video: any) => {
        const publicUrl: string | null = video.file_path
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${video.file_path}`
            : null;

        const likes_count = video.likes?.length || 0;
        const comments: Comment[] = video.comments || [];

        return { ...video, url: publicUrl, likes_count, comments };
    });

    return videosWithUrls;
}

