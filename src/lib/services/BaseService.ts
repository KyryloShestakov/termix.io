import { supabase } from "@/utils/supabase/supabase";

export default class BaseService<T> {
    protected table: string;

    constructor(table: string) {
        this.table = table;
    }

    async getAll(): Promise<T[]> {
        // @ts-ignore
        const { data, error } = await supabase.from<T>(this.table).select("*");
        if (error) throw error;
        return data || [];
    }

    async getById(id: string | number): Promise<T | null> {
        // @ts-ignore
        const { data, error } = await supabase.from<T>(this.table)
            .select("*")
            .eq("id", id)
            .maybeSingle();
        if (error) throw error;
        return data || null;
    }

    async create(item: Partial<T>): Promise<T | null> {
        // @ts-ignore
        const { data, error } = await supabase.from<T>(this.table)
            .insert(item)
            .select()
            .maybeSingle();
        if (error) throw error;
        return data || null;
    }

    async delete(id: string | number): Promise<boolean> {
        // @ts-ignore
        const { error } = await supabase.from<T>(this.table)
            .delete()
            .eq("id", id);
        if (error) throw error;
        return true;
    }

    async update(id: string | number, item: Partial<T>): Promise<T | null> {
        // @ts-ignore
        const { data, error } = await supabase.from<T>(this.table)
            .update(item)
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data || null;
    }

}
