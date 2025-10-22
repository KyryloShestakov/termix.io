export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    email?: string | null;
                };
                Update: {
                    email?: string | null;
                };
            };
            channels: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    is_private: boolean;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    name: string;
                    is_private?: boolean;
                };
                Update: {
                    name?: string;
                    is_private?: boolean;
                };
            };
            videos: {
                Row: {
                    id: string;
                    channel_id: string;
                    title: string;
                    url: string;
                    created_at: string;
                };
                Insert: {
                    channel_id: string;
                    title: string;
                    url: string;
                };
                Update: {
                    title?: string;
                    url?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
        CompositeTypes: {};
    };
}
