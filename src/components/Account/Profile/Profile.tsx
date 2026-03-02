import {User} from "@supabase/auth-js";
import {useEffect, useState} from "react";
import ProfileHeader from "@/components/Account/Profile/ProfileHeader";
import ProfileStats from "@/components/Account/Profile/ProfileStats";
import styles from "./Profile.module.css"
import ProfileSettings from "@/components/Account/Profile/ProfileSettings";
import SubscribersList from "@/components/Account/Profile/SubscribersList";
import ProfileTabs, {Tab} from "@/components/Account/Profile/ProfileTabs";
import {getProfileById} from "@/lib/api/profile";
import {ProfileType} from "@/types";
import PrivateInformation from "@/components/Account/Profile/PrivateInformation";

type ProfileProps = {
    user: User;
}

export default function Profile({user}: ProfileProps) {
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            // решить это
            // @ts-ignore
            const data = await getProfileById(user.id);
            setProfile(data);
            setLoading(false);
        }

        fetchProfile();
    }, [user.id]);

    if (loading) return <p>Loading...</p>;
    // создавать профиль при регистрации
    if (!profile) return <p>Profile not found</p>;
    return (
        <div className={styles.profileContainer}>
            <ProfileHeader user={user} profile={profile}/>
            <ProfileStats user={user} />
            <ProfileTabs>
                <Tab title="Private information">
                    <PrivateInformation user={user} profile={profile}/>
                </Tab>
                <Tab title="Subscriptions">
                    <SubscribersList user={user} />
                </Tab>
                <Tab title="Settings">
                    <ProfileSettings user={user} />
                </Tab>
            </ProfileTabs>
        </div>
    );
}