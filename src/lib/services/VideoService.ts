// lib/services/VideoService.ts
import BaseService from "./BaseService";
import { Video } from "@/types";
import {supabase} from "@/utils/supabase/supabase";

interface UploadVideoResult {
    video?: Video | null;
    url?: string | null;
    error?: any;
}

export default class VideoService extends BaseService<Video> {
    constructor() {
        super("videos");
    }

    private from() {
        // @ts-ignore
        return supabase.from(this.table);
    }

    async getVideos(channelId?: string, videoId?: string): Promise<Video[]> {
        let query = this.from().select(`
            *,
            likes:likes(id),
            comments:comments(*)
        `).order("created_at", { ascending: false });

        if (channelId) query = query.eq("channel_id", channelId);
        if (videoId) query = query.eq("id", videoId);

        const { data, error } = await query;

        if (error || !data) return [];

        return data.map((video: any) => {
            const publicUrl = video.file_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${video.file_path}`
                : null;
            return {
                ...video,
                url: publicUrl,
                likes_count: video.likes?.length || 0,
                comments: video.comments || []
            };
        });
    }

    async uploadVideo(file: File, userId: string, channelId: string, title: string, description: string, isPrivate: boolean): Promise<UploadVideoResult> {
        try {
            if (!userId) throw new Error("User ID is required");
            const fileName = `${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("videos")
                .upload(fileName, file, { cacheControl: "3600", upsert: false, metadata: { owner_id: userId } });

            if (uploadError) throw uploadError;

            const { data: publicData } = supabase.storage.from("videos").getPublicUrl(fileName);
            const publicUrl = publicData?.publicUrl || null;

            const { data: videoData, error: dbError } = await supabase
                .from(this.table)
                .insert({
                    owner_id: userId,
                    channel_id: channelId,
                    title,
                    description,
                    file_path: fileName,
                    is_private: isPrivate,
                    views: 0
                })
                .select()
                .maybeSingle();

            if (dbError || !videoData) throw dbError;

            const video: Video = {
                ...videoData!,
                url: publicUrl,
                likes_count: 0,
                comments: []
            };

            return { video, url: publicUrl };

        } catch (error) {
            console.error("VideoService.uploadVideo error:", error);
            return { error };
        }
    }
}
