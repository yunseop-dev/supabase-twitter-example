import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "../supabaseClient";
import { QueryData } from "@supabase/supabase-js";

const tweetQuery = supabaseClient.from("tweets").select(`*,
     user:users!tweets_userid_fkey(*),
        comments(
        *,
        user:users!comments_userid_fkey(*)
        ),
        like:likes!likes_tweetid_fkey(count)
`);

export type Tweet = QueryData<typeof tweetQuery>[0];

export const useTweet = (tweetId: string) => {
    const [tweet, setTweet] = useState<Tweet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getTweet = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await tweetQuery.eq("id", tweetId).single();
            if (error) throw error;
            setTweet(data);
        } catch (err) {
            setError("트윗을 불러오는 데 실패했습니다.");
            console.error("Error fetching tweet:", err);
        } finally {
            setIsLoading(false);
        }
    }, [tweetId]);

    useEffect(() => {
        getTweet();
    }, [getTweet]);

    return { tweet, isLoading, error };
};