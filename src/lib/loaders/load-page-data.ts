import { videoService} from "@/lib/services";
import getUser from "@/lib/api/user";
import { Video } from "@/types";
import { User } from "@supabase/auth-js";

interface PageDataResult {
    videos?: Video[];
    user?: User;
    error?: any;
}
// надо это как то грамотно переделать
export async function loadPageData(): Promise<PageDataResult> {
    try {
        const result: PageDataResult = {};
        const videos = await videoService.getVideos();
        result.videos = videos;
        const user = await getUser();
        result.user = user || null;

        return result;
    } catch (error) {
        console.error("Error loading page data:", error);
        return {error};
    }
}
