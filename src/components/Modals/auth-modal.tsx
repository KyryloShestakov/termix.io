"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import "../Modals/auth-modal-styles.css";

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
        const url = isLogin ? "/api/auth/signin" : "/api/auth/signup";
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log(data);
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin },
        });
        if (error) console.log("Google login error:", error.message);
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
                    <button className="submit-btn" type="submit">
                        {isLogin ? "Login" : "Register"}
                    </button>
                </form>

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
