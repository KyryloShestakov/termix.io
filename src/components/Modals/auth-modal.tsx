"use client";
import { useState, useEffect } from "react";
import "../Modals/auth-modal-styles.css";
import {supabase} from "@/utils/supabase/supabase";
import {signInWithGoogle} from "@/app/auth/auth";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    nextUrl?: string;
};

export default function AuthModal({ isOpen, onClose, nextUrl }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {
            let data, error;

            if (isLogin) {
                ({ data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                }));
            } else {
                ({ data, error } = await supabase.auth.signUp({
                    email,
                    password,
                }));
            }

            if (error) {
                setErrorMsg(error.message);
                return;
            }

            onClose();
            window.location.reload();
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    async function handleGoogleLogin() {
        const { url } = await signInWithGoogle("/");
        if (url) {
            window.location.href = url
        }
    }


    return (
        <div className="auth-modal-overlay"
             onClick={(e) => {
                 if (e.target === e.currentTarget) {
                     onClose();
                 }
             }}>
            <div className="auth-modal-container">
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>
                <h2>{isLogin ? "Login" : "Register"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            required
                        />
                    )}
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? "Loading..." : isLogin ? "Login" : "Register"}
                    </button>
                </form>

                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

                <button className="google-btn" onClick={handleGoogleLogin}>
                    Continue with Google
                </button>

                <p className="toggle-text">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Register" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}
