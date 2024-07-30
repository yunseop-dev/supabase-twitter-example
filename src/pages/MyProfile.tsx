import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { ProfileForm } from '../components/ProfileForm';

export default function MyProfile() {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { user, setUser, fetchUser } = useUser(userId);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">내 프로필</h1>
            {user?.profile && (
                <div className="mb-4 flex justify-center">
                    <img src={user.profile} alt="profile" className="w-32 h-32 rounded-full object-cover" />
                </div>
            )}
            {user ? (
                <ProfileForm user={user} setUser={setUser} fetchUser={fetchUser} />
            ) : (
                <p className="text-center text-gray-600">로그인이 필요합니다.</p>
            )}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                홈으로
            </button>
        </div>
    );
}