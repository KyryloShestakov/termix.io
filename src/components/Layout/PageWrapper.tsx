"use client";

import { useState } from "react";
import Header from "@/components/Header/Header";
import MainSideBar from "@/components/Side-bar/main-side-bar";
import AuthModal from "@/components/Modals/auth-modal";
import styles from "./PageWrapper.module.css"

type Props = {
    children: React.ReactNode;
    hideSidebar?: boolean;
};

export default function PageWrapper({ children, hideSidebar = false }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.wrapper}>
            <Header onOpenAuthModal={() => setIsModalOpen(true)}/>

            <div className={styles.body}>
                {!hideSidebar && <MainSideBar />}
                <main className={styles.main}>
                    {children}
                </main>
            </div>

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
