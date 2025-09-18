"use client";
import {useEffect, useState} from "react";
import AuthModal from "@/components/Modals/auth-modal";
import "./styles.css";
import Header from "@/components/Header/Header";
import useUser from "@/components/Fetch/use-user";
import FetchVideos from "@/components/Videos/get-videos";
import MainSideBar from "@/components/Side-bar/main-side-bar";
import VideoGrid from "@/components/Grid/video-grid";

type Video = {
    id: string;
    title: string;
    description: string;
    file_path: string;
    is_private: boolean;
    url: string | null;
    [key: string]: any;
};

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const user = useUser();

    useEffect(() => {
        const loadVideos = async () => {
            const vids = await FetchVideos();
            setVideos(vids);
        };
        loadVideos();
    }, [user]);



    return (
        <div>

            <Header onOpenAuthModal={() => setIsModalOpen(true)} />

            <div className="main">
                <MainSideBar/>
                <VideoGrid videos={videos}/>
            </div>

            <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
