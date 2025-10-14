import {supabase} from "@/lib/supabase";

export default async function getUser(){
    const { data } = await supabase.auth.getUser();

    return data;
}