import React, { useState, ReactNode } from "react";
import styles from "./Profile.module.css";

type TabProps = {
    title: string;
    children: ReactNode;
};

export function Tab({ title, children }: TabProps) {
    return <>{children}</>;
}

type Props = {
    children: React.ReactElement<TabProps>[];
};

export default function ProfileTabs({ children }: Props) {
    const [activeTab, setActiveTab] = useState(children[0].props.title);

    return (
        <div className={styles.tabs}>
            <div className={styles.tabButtons}>
                {children.map((child) => (
                    <button
                        key={child.props.title}
                        onClick={() => setActiveTab(child.props.title)}
                        className={activeTab === child.props.title ? styles.active : ""}
                    >
                        {child.props.title}
                    </button>
                ))}
            </div>
            <div className={styles.tabContent}>
                {children.find((child) => child.props.title === activeTab)}
            </div>
        </div>
    );
}
