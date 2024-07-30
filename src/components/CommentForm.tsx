// components/CommentForm.tsx
import React from 'react';
import { supabaseClient } from "../supabaseClient";

interface CommentFormProps {
    tweetId: string;
    onCommentCreated: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ tweetId, onCommentCreated }) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const content = formData.get("content")?.toString() ?? '';
        await supabaseClient.from("comments").insert({
            content,
            tweet_id: tweetId,
        });
        onCommentCreated();
        e.currentTarget.reset();
    };

    return (
        <form onSubmit={handleSubmit} className="mt-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">댓글:</label>
            <input type="text" name="content" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            <button type="submit" className="mt-2 px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">댓글</button>
        </form>
    );
};
