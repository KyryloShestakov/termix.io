"use client";

import {useState} from "react";
import Header from "@/components/Header/Header";
import AuthModal from "@/components/Modals/auth-modal";
import styles from "./PageWrapper.module.css"
import {User} from "@supabase/auth-js";


type Props = {
    children: React.ReactNode;
    user?: User;
};

export default function PageWrapper({ children, user }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className={styles.wrapper}>
            <Header onOpenAuthModal={() => setIsModalOpen(true)} user={user}/>
            <div className={styles.body}>
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
