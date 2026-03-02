"use client";

import React, { useState, useEffect } from "react";
import styles from "./search.module.css";
import { Search } from "lucide-react";

type SearchVideo = {
    id: string;
    title: string;
};

export default function SearchInput() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<SearchVideo[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([]);
            setOpen(false);
            return;
        }

        const delay = setTimeout(async () => {
            const res = await fetch(`/api/search?q=${query}`);
            const list: SearchVideo[] = await res.json();
            setSuggestions(list);
            setOpen(true);
        }, 200);

        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className={styles.searchContainer}>
            <input
                className={styles.searchInput}
                placeholder="Search videos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
            />

            <Search className={styles.searchIcon} size={18} />

            {open && suggestions.length > 0 && (
                <div className={styles.dropdown}>
                    {suggestions.map((s) => (
                        <a key={s.id} href={`/video/${s.id}`} className={styles.item}>
                            {s.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}
