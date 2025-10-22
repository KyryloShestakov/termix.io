"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

// Описываем контекст
interface SessionContextType {
    session: Session | null;
    supabase: SupabaseClient;
}

// Создаем контекст с дефолтным значением null
const SessionContext = createContext<SessionContextType | null>(null);

// Пропсы компонента
interface SessionProviderProps {
    children: ReactNode;
    session: Session | null;
}

export async function SessionProvider({ children, session: initialSession }: SessionProviderProps) {
    const [session, setSession] = useState<Session | null>(initialSession);
    const supabase = await createClient();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    return (
        <SessionContext.Provider value={{ session, supabase }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}
