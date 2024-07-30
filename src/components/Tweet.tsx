// components/Tweet.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { supabaseClient } from "../supabaseClient";
import { CommentForm } from './CommentForm';
import { Tweet as TweetType } from '../types';

interface TweetProps {
    tweet: TweetType;
    userId: string | null;
    tweetId: number;
    onUpdate: () => void;
}

export const Tweet: React.FC<TweetProps> = ({ tweet, userId, tweetId, onUpdate }) => {
    const handleLike = async () => {
        const { data: likes } = await supabaseClient.from("likes").select().eq("tweet_id", tweet.id).eq("user_id", userId ?? '');
        if ((likes?.length ?? 0) > 0) {
            await supabaseClient.from("likes").delete().eq("tweet_id", tweet.id);
        } else {
            await supabaseClient.from("likes").insert({
                tweet_id: tweet.id,
            });
        }
        onUpdate();
    };

    const handleDelete = async () => {
        await supabaseClient.from("tweets").delete().eq("id", tweet.id);
        onUpdate();
    };

    return (
        <li className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-start">
                <div>
                    <Link to={`/tweet/${tweet.id}`} className="text-indigo-600 hover:text-indigo-900">트윗 {tweetId}</Link>
                    <p className="mt-1 text-sm text-gray-900">{tweet.user?.name}: {tweet.content}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={handleLike} className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-1 px-2 rounded">
                        좋아요 {tweet.like[0].count}개
                    </button>
                    {userId === tweet.user?.id && (
                        <button onClick={handleDelete} className="text-sm bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-2 rounded">
                            트윗 삭제
                        </button>
                    )}
                </div>
            </div>
            <CommentForm tweetId={tweet.id} onCommentCreated={onUpdate} />
            <ul className="mt-2 space-y-2">
                {tweet.comments.map((comment, commentId) => (
                    <li key={comment.id} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        댓글 {commentId} / {comment.user?.name}: {comment.content}
                        {userId === comment.user?.id && (
                            <button
                                onClick={async () => {
                                    await supabaseClient.from("comments").delete().eq("id", comment.id);
                                    onUpdate();
                                }}
                                className="ml-2 text-xs bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-1 px-2 rounded"
                            >
                                댓글 삭제
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </li>
    );
};
