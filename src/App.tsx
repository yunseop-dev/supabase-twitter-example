import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from "./supabaseClient";
import { useTweets } from './hooks/useTweets';
import { useAuth } from './hooks/useAuth';
import { TweetForm } from './components/TweetForm';
import { Tweet } from './components/Tweet';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { tweets, getTweets } = useTweets();
  const { userId } = useAuth();

  React.useEffect(() => {
    if (userId) {
      getTweets();
    }
  }, [userId, getTweets]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">트위터 클론</h1>
      <TweetForm onTweetCreated={getTweets} />
      <ul className="space-y-4">
        {tweets?.map((tweet, index) => (
          <Tweet key={tweet.id} tweet={tweet} userId={userId} tweetId={index} onUpdate={getTweets} />
        ))}
      </ul>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={async () => {
            await supabaseClient.auth.signOut();
            navigate("/sign-in");
          }}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          로그아웃
        </button>
        <button
          onClick={() => navigate("/my-profile")}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          내 정보
        </button>
      </div>
    </div>
  );
};

export default App;