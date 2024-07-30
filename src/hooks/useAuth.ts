// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from "../supabaseClient";

export const useAuth = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_, session) => {
            if (!session) {
                navigate("/sign-in");
                return;
            }
            setUserId(session.user.id);
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return { userId };
};
