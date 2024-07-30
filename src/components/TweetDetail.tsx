import React from 'react';
import { Tweet } from '../hooks/useTweet';
import { CommentList } from './CommentList';
import { format } from 'date-fns';

interface TweetDetailProps {
    tweet: Tweet;
}

export const TweetDetail: React.FC<TweetDetailProps> = ({ tweet }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800">{tweet.user?.name}</h1>
                <p className="mt-2 text-gray-600">{tweet.content}</p>
                <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <span className="mr-4">좋아요: {tweet.like[0].count}</span>
                    <span>작성일: {format(new Date(tweet?.created_at ?? ''), 'yyyy년 MM월 dd일 HH:mm')}</span>
                </div>
            </div>
            <div className="px-6 pb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">댓글</h2>
                <CommentList comments={tweet.comments} />
            </div>
        </div>
    );
};