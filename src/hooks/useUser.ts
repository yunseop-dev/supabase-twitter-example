import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from "../supabaseClient";
import { Database } from "../types/supabase";

type User = Database['public']['Tables']['users']['Row'];

export const useUser = (userId: string | null) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error) {
            console.error(error);
        } else {
            setUser(data);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, setUser, fetchUser };
};