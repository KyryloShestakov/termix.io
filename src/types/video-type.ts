export interface Video {
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
    channel_id: string;
    created_at: string;
};

export interface Comment {
    id: string;
    user_id: string;
    userName: string;
    content: string;
    created_at: string;
}