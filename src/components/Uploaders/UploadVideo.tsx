import { supabase } from "@/lib/supabase";

export const uploadVideo = async (
    file: File,
    userId: string,
    channelId: string,
    title: string,
    description: string,
    isPrivate: boolean
) => {
    const fileName = `${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, file);

    if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: uploadError };
    }

    // Публичный URL
    const { data: publicData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);
    const publicUrl = publicData?.publicUrl || null;

    // Сохраняем метаданные
    const { data: videoData, error: dbError } = await supabase
        .from("videos")
        .insert([
            {
                owner_id: userId,
                channel_id: channelId,
                title: title,
                description: description,
                file_path: fileName,
                is_private: isPrivate,
            },
        ])
        .select()
        .single();

    if (dbError) {
        console.error("DB error:", dbError);
        return { error: dbError };
    }

    return { video: videoData, url: publicUrl };
};
