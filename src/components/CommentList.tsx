import React from 'react';
import { Tweet } from '../hooks/useTweet';

interface CommentListProps {
    comments: Tweet['comments'];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <ul className="space-y-4 mt-6">
            {comments.map((comment) => (
                <li key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold text-gray-700">{comment.user?.name}</p>
                    <p className="text-gray-600 mt-1">{comment.content}</p>
                </li>
            ))}
        </ul>
    );
};