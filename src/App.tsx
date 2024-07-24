import { useEffect, useState } from "react";
import { supabaseClient } from "./supabaseClient";
import type { QueryData } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router-dom";
const tweetsQuery = supabaseClient
  .from("tweets")
  .select(`*, 
    comments(
      *,
      user:users!comments_userid_fkey(*)
    ),
    like:likes!likes_tweetid_fkey(count),
    user:users!tweets_userid_fkey(*)`)
type TweetsWithComments = QueryData<typeof tweetsQuery>

const App = () => {
  const navigate = useNavigate();
  const [tweets, setTweets] = useState<TweetsWithComments | null>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const getTweets = async () => {
    const { data } = await tweetsQuery
    setTweets(data);
  };

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        navigate("/sign-in");
        return;
      }
      setUserId(session.user.id);
      getTweets();
    });
  }, [navigate]);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const content = formData.get("content")?.toString() ?? '';
          await supabaseClient.from("tweets").insert({ content });
          getTweets().then(() => {
            const form = e.target as HTMLFormElement;
            form.reset();
          });
        }}
      >
        <label htmlFor="content">트윗:</label>
        <input type="text" name="content" />
        <button type="submit">트윗</button>
      </form>
      <ul>
        {tweets?.map((tweet, tweetId) => (
          <li key={tweet.id}>
            <Link to={`/tweet/${tweet.id}`}>트윗 {tweetId}</Link>
            / {tweet.user?.name}: {tweet.content}
            / <button onClick={
              async () => {
                // check if the user already liked the tweet with the current user id
                const { data: likes } = await supabaseClient.from("likes").select().eq("tweet_id", tweet.id).eq("user_id", userId ?? '');
                if ((likes?.length ?? 0) > 0) {
                  await supabaseClient.from("likes").delete().eq("tweet_id", tweet.id);
                } else {
                  await supabaseClient.from("likes").insert({
                    tweet_id: tweet.id,
                  });
                }
                getTweets();
              }
            }>좋아요 {tweet.like[0].count}개</button>
            {userId === tweet.user?.id &&
              <button onClick={
                async () => {
                  await supabaseClient.from("tweets").delete().eq("id", tweet.id);
                  getTweets();
                }}>트윗 삭제</button>
            }
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const content = formData.get("content")?.toString() ?? '';
                await supabaseClient.from("comments").insert({
                  content,
                  tweet_id: tweet.id,
                });
                getTweets().then(() => {
                  const form = e.target as HTMLFormElement;
                  form.reset();
                });
              }}
            >
              <label htmlFor="content">댓글:</label>
              <input type="text" name="content" />
              <button type="submit">댓글</button>
            </form>
            <ul>
              {tweet.comments.map((comment, commentId) => (<li key={comment.id}>
                댓글 {commentId} / {comment.user?.name}: {comment.content} /
                {userId === comment.user?.id &&
                  <button onClick={
                    async () => {
                      await supabaseClient.from("comments").delete().eq("id", comment.id);
                      getTweets();
                    }}>댓글 삭제</button>
                }
              </li>))}
            </ul>
          </li>
        ))}
      </ul>
      <button onClick={
        async () => {
          await supabaseClient.auth.signOut();
          navigate("/sign-in");
        }
      }>로그아웃</button>
      <button onClick={
        async () => {
          navigate("/my-profile");
        }
      }>내 정보</button>
    </>
  );
};

export default App
