import { createClient } from "@/utils/supabase/server";
import {User} from "@supabase/auth-js";

export default async function getUser(){
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser()
    return user as User;
}

