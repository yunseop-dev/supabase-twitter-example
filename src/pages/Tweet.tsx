import { useParams } from "react-router-dom";
import { supabaseClient } from "../supabaseClient";
import { QueryData } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

const tweetQuery = supabaseClient.from("tweets").select(`*,
     user:users!tweets_userid_fkey(*),
        comments(
        *,
        user:users!comments_userid_fkey(*)
        ),
        like:likes!likes_tweetid_fkey(count)
`);
type Tweet = QueryData<typeof tweetQuery>

export default function Tweet() {
    const { tweetId = '' } = useParams();
    const [tweet, setTweet] = useState<Tweet[0] | null>(null);
    const getTweet = useCallback(async () => {
        const { data } = await tweetQuery.eq("id", tweetId).single();
        return data;
    }, [tweetId])
    useEffect(() => {
        getTweet().then((res) => setTweet(res));
    }, [getTweet])
    return (
        <div>
            <button onClick={
                () => {
                    window.history.back();
                }
            }>뒤로가기</button>
            <h1>{tweet?.user?.name}</h1>
            <p>
                {tweet?.content}
            </p>
            <div>좋아요: {tweet?.like[0].count}</div>
            <div>작성일: {tweet?.created_at}</div>
            <ul>
                {tweet?.comments.map((comment) => (
                    <li key={comment.id}>
                        {comment.user?.name}:{comment.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}