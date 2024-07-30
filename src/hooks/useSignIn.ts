import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../supabaseClient';
import { AuthError } from '@supabase/supabase-js';

export const useSignIn = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const signIn = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            navigate('/');
            return data;
        } catch (err) {
            if (err instanceof AuthError) {
                setError(`로그인 오류: ${err.message}`);
                console.error('로그인 오류:', err.name, err.message);
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
                console.error('알 수 없는 오류:', err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { signIn, error, isLoading };
};