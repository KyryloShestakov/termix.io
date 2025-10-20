"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // убедись, что это клиент для браузера
import "../Modals/auth-modal-styles.css";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Закрытие модалки по Esc
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

    const handleGoogleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin, // после логина вернёт на текущую страницу
            },
        });

        if (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="auth-modal-overlay">
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
