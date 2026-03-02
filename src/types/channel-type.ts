export interface ChannelType {
    id: string;
    name: string;
    username?: string;
    owner_id: string;
    description?: string;
    avatar_url?: string;
    banner_url?: string;
    created_at: string;
    updated_at?: string;

    videos_count?: number;
    latest_video_id?: string;
    featured_videos?: string[];

    subscribers_count?: number;
    views_count?: number;
    likes_count?: number;
    comments_count?: number;

    is_private?: boolean;
    notifications_enabled?: boolean;
    category?: string;
    tags?: string[];

    social_links?: string[];
    website?: string;

    topics?: string[];
    language?: string;
    region?: string;
}


export interface Subscription {
    id: number;
    subscriber_id: string;
    channel_id: string;
    subscribed_at: string;
}
