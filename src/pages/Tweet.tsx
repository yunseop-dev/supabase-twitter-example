import { useParams, useNavigate } from "react-router-dom";
import { useTweet } from "../hooks/useTweet";
import { TweetDetail } from "../components/TweetDetail";

export default function Tweet() {
    const { tweetId = '' } = useParams();
    const navigate = useNavigate();
    const { tweet, isLoading, error } = useTweet(tweetId);

    if (isLoading) {
        return <div className="text-center py-10">로딩 중...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!tweet) {
        return <div className="text-center py-10">트윗을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
            >
                뒤로가기
            </button>
            <TweetDetail tweet={tweet} />
        </div>
    );
}