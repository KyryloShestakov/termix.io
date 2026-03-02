"use client";
import React, { useEffect, useState, useRef } from "react";
import "./Header-styles.css";
import Link from "next/link";
import {User} from "@supabase/auth-js";
import {signOut} from "@/app/auth/auth";
import SearchInput from "@/components/Search/SearchInput";
import {getProfileById} from "@/lib/api/profile";
import {ProfileType} from "@/types";
import styles from "@/components/Account/Profile/Profile.module.css";
import AvatarFallback from "@/components/AvatarFallback";

type HeaderProps = {
    onOpenAuthModal: () => void;
    user?: User;
};

export default function Header({ onOpenAuthModal, user }: HeaderProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        await signOut();
        setMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="left-section">
                <a href="/" className="logo">
                    <h1>Termix.io</h1>
                </a>
                <SearchInput />
            </div>
            {user ? (
                <div className="user-avatar-wrapper" ref={menuRef}>
                    <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                        {getInitial()}
                    </div>

                    {menuOpen && (
                        <div className="avatar-menu animate-slide-in">
                            <p className="menu-email">{user.email}</p>

                            <Link href="/private" className="menu-link">
                                Account
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
