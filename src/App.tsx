import { useEffect, useState } from "react";
import { supabaseClient } from "./supabaseClient";
import type { QueryData } from "@supabase/supabase-js";
const tweetsQuery = supabaseClient
  .from("tweets")
  .select(`*, 
    comments(
      *,
      user:users!comments_userid_fkey(*)
    ),
    user:users!tweets_userid_fkey(*)`)
type TweetsWithComments = QueryData<typeof tweetsQuery>

const App = () => {
  const [tweets, setTweets] = useState<TweetsWithComments | null>([]);

  const getTweets = async () => {
    const { data } = await tweetsQuery
    return data;
  };

  useEffect(() => {
    getTweets().then((res) => setTweets(res));
  }, []);

  return (
    <ul>
      {tweets?.map((tweet) => (
        <li key={tweet.id}>
          {tweet.user?.name}: {tweet.content}
          <ul>
            {tweet.comments.map((comment) => (<li key={comment.id}>
              {comment.user?.name}: {comment.content}
            </li>))}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default App
