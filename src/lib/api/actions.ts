import {supabase} from "@/utils/supabase/supabase";
import {Video} from "@/types";
import {User} from "@supabase/auth-js";

type LikeProps = {
    video: Video;
    user: User;
}

type CommentProps = {
    video: Video;
    user: User;
    comment?: string;
    commentId?: string;
    profile?: { username: string };
};

export async function toggleLike({ video, user }: LikeProps): Promise<Video | undefined> {
    if (!video || !user) return;

    const { data: existingLikes, error: fetchError } = await supabase
        .from("likes")
        .select("*")
        .eq("video_id", video.id)
        .eq("user_id", user.id);

    if (fetchError) {
        console.error("Error fetching like:", fetchError);
        return video;
    }

    let updatedVideo = { ...video };

    if (existingLikes && existingLikes.length > 0) {
        const { error: deleteError } = await supabase
            .from("likes")
            .delete()
            .eq("video_id", video.id)
            .eq("user_id", user.id);

        if (deleteError) {
            console.error("Error removing like:", deleteError);
            return video;
        }

        updatedVideo.likes_count = (video.likes_count || 1) - 1;
    } else {
        const { error: insertError } = await supabase
            .from("likes")
            .insert({ video_id: video.id, user_id: user.id });

        if (insertError) {
            console.error("Error adding like:", insertError);
            return video;
        }

        updatedVideo.likes_count = (video.likes_count || 0) + 1;
    }

    return updatedVideo;
}

export async function addComment({ video, user, comment, profile }: CommentProps): Promise<Video | undefined> {
    if (!video || !user || !comment?.trim()) return;

    const { data, error } = await supabase
        .from("comments")
        .insert({ video_id: video.id, user_id: user.id, content: comment, userName: profile?.username })
        .select()
        .single();

    if (error) {
        console.error("Error adding comment:", error);
        return video;
    }

    return { ...video, comments: [...video.comments, data] };
}

export async function editComment({ video, user, commentId, comment }: CommentProps): Promise<Video | undefined> {
    if (!video || !user || !commentId || !comment?.trim()) return;

    const { data, error } = await supabase
        .from("comments")
        .update({ content: comment })
        .eq("id", commentId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error editing comment:", error);
        return video;
    }

    const updatedComments = video.comments.map(c => (c.id === commentId ? data : c));
    return { ...video, comments: updatedComments };
}

export async function deleteComment({ video, user, commentId }: CommentProps): Promise<Video | undefined> {
    if (!video || !user || !commentId) return;

    const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting comment:", error);
        return video;
    }

    const updatedComments = video.comments.filter(c => c.id !== commentId);
    return { ...video, comments: updatedComments };
}
