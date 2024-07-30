// hooks/useTweets.ts
import { useState, useCallback } from 'react';
import { supabaseClient } from "../supabaseClient";
import type { TweetsWithComments } from '../types';

export const useTweets = () => {
    const [tweets, setTweets] = useState<TweetsWithComments | null>([]);

    const getTweets = useCallback(async () => {
        const { data } = await supabaseClient
            .from("tweets")
            .select(`*, 
        comments(
          *,
          user:users!comments_userid_fkey(*)
        ),
        like:likes!likes_tweetid_fkey(count),
        user:users!tweets_userid_fkey(*)`);
        setTweets(data);
    }, []);

    return { tweets, getTweets };
};
