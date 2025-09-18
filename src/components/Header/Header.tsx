"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import "./Header-styles.css";
import Link from "next/link";

type HeaderProps = {
    onOpenAuthModal: () => void;
};

export default function Header({ onOpenAuthModal }: HeaderProps) {
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        fetchUser();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Закрытие меню при клике вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getInitial = () => {
        if (!user?.email) return "";
        return user.email.charAt(0).toUpperCase();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <a href={"/"}><h1>Termix.io</h1></a>
            {user ? (
                <div className="user-avatar-wrapper" ref={menuRef}>
                    <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                        {getInitial()}
                    </div>

                    {menuOpen && (
                        <div className="avatar-menu animate-slide-in">
                            <p className="menu-email">{user.email}</p>

                            <Link href="/channel" className="menu-link">
                                Channel
                            </Link>

                            <div className="menu-actions">
                                <button onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={onOpenAuthModal}>Login / Register</button>
            )}
        </header>
    );
}
