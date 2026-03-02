export interface ProfileType {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    age?: number;
    phone?: string;
    location?: string;
    background_image_url?: string;
    avatar_url?: string;
    bio?: string;
    is_private: boolean;
    website?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    created_at: string;
    updated_at: string;
}
