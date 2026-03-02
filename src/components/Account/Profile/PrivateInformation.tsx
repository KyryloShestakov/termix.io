"use client";
import {useState} from "react";
import styles from "./Profile.module.css";
import {ProfileType} from "@/types";
import {User} from "@supabase/auth-js";
import {profileService} from "@/lib/services";

type Props = {
    profile: ProfileType,
    user: User,
}

export default function PrivateInformation({profile, user}: Props) {
    const [name, setName] = useState(profile.name);
    const [surname, setSurname] = useState(profile.surname);
    const [username, setUsername] = useState(profile.username);
    const [email, setEmail] = useState(profile.email);
    const [age, setAge] = useState(profile.age ? String(profile.age) : "");
    const [phone, setPhone] = useState(profile.phone);
    const [location, setLocation] = useState(profile.location);
    const [background, setBackground] = useState(profile.background_image_url);
    const [avatar_url, setAvatar_url] = useState(profile.avatar_url);
    const [bio, setBio] = useState(profile.bio);
    const [isPrivate, setIsPrivate] = useState(profile.is_private);
    const [website, setWebsite] = useState(profile.website);
    const [twitter, setTwitter] = useState(profile.twitter);
    const [instagram, setInstagram] = useState(profile.instagram);

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updates: Partial<ProfileType> = {};

            if (name !== profile.name) updates.name = name;
            if (surname !== profile.surname) updates.surname = surname;
            if (username !== profile.username) updates.username = username;
            if (email !== profile.email) updates.email = email;
            // @ts-ignore
            if ((age ? parseInt(age) : null) !== profile.age) updates.age = age ? parseInt(age) : null;
            if (phone !== profile.phone) updates.phone = phone;
            if (location !== profile.location) updates.location = location;
            if (website !== profile.website) updates.website = website;
            if (twitter !== profile.twitter) updates.twitter = twitter;
            if (instagram !== profile.instagram) updates.instagram = instagram;
            if (avatar_url !== profile.avatar_url) updates.avatar_url = avatar_url;
            if (background !== profile.background_image_url) updates.background_image_url = background;
            if (bio !== profile.bio) updates.bio = bio;
            if (isPrivate !== profile.is_private) updates.is_private = isPrivate;

            updates.updated_at = new Date().toISOString();

            if (Object.keys(updates).length > 0) {
                const updatedProfile = await profileService.update(profile.id, updates);
                console.log("Profile updated:", updatedProfile);
                alert("Profile saved successfully!");
            } else {
                alert("No changes detected");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to save profile.");
        }
        setLoading(false);
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Private Information</h2>

            <div className={styles.card}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Name</label>
                        <input value={name} onChange={e => setName(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Surname</label>
                        <input value={surname} onChange={e => setSurname(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Username</label>
                        <input value={username} onChange={e => setUsername(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Email</label>
                        <input value={email} onChange={e => setEmail(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Age</label>
                        <input value={age} onChange={e => setAge(e.target.value)} type="number"/>
                    </div>

                    <div className={styles.field}>
                        <label>Phone</label>
                        <input value={phone} onChange={e => setPhone(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Location</label>
                        <input value={location} onChange={e => setLocation(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Website</label>
                        <input value={website} onChange={e => setWebsite(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Twitter</label>
                        <input value={twitter} onChange={e => setTwitter(e.target.value)}/>
                    </div>

                    <div className={styles.field}>
                        <label>Instagram</label>
                        <input value={instagram} onChange={e => setInstagram(e.target.value)}/>
                    </div>
                </div>

                <div className={styles.fieldFull}>
                    <label>Avatar URL</label>
                    <input value={avatar_url} onChange={e => setAvatar_url(e.target.value)}/>
                </div>

                <div className={styles.fieldFull}>
                    <label>Background Image</label>
                    <input value={background} onChange={e => setBackground(e.target.value)}/>
                </div>

                <div className={styles.fieldFull}>
                    <label>Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}/>
                </div>

                <div className={styles.toggleRow}>
                    <label>Private Profile</label>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={() => setIsPrivate(!isPrivate)}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>

                <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
