// types.ts
import { QueryData } from "@supabase/supabase-js";
import { supabaseClient } from "../supabaseClient";

const tweetsQuery = supabaseClient
    .from("tweets")
    .select(`*, 
    comments(
      *,
      user:users!comments_userid_fkey(*)
    ),
    like:likes!likes_tweetid_fkey(count),
    user:users!tweets_userid_fkey(*)`)

export type TweetsWithComments = QueryData<typeof tweetsQuery>;
export type Tweet = TweetsWithComments[number];

