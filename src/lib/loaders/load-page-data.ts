import { videoService } from "@/lib/services";
import getUser from "@/lib/api/user";
import { Video } from "@/types";
import { User } from "@supabase/auth-js";

interface PageDataResult {
    videos: Video[];
    user: User | null;
}

export async function loadPageData(): Promise<PageDataResult> {
    const [videosResult, userResult] = await Promise.allSettled([
        videoService.getVideos(),
        getUser(),
    ]);

    const videos =
        videosResult.status === "fulfilled" ? videosResult.value : [];

    const user =
        userResult.status === "fulfilled" ? userResult.value ?? null : null;

    return { videos, user };
}