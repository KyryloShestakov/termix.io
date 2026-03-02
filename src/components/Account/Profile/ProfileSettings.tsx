import {User} from "@supabase/auth-js";

type ProfileSettingsProps = {
    user: User;
}

export default function ProfileSettings(user: ProfileSettingsProps) {
    return (
        <div>
            <h1>Settings</h1>
        </div>
    )
}