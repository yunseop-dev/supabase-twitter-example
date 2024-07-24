import { useCallback, useEffect, useState } from "react";
import { supabaseClient } from "../supabaseClient";
import { Database } from "../types/supabase";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState<string | null>(null);
    const [user, setUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!user) return;
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name")?.toString() ?? "";
        await supabaseClient.from("users").upsert({
            ...user,
            name,
        });
    };

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        const { data, error } = await supabaseClient
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error) {
            console.error(error);
        } else {
            setUser(data);
        }
    }, [userId]);

    useEffect(() => {
        supabaseClient.auth.onAuthStateChange(async (_, session) => {
            if (!session) {
                navigate("/sign-in");
                return;
            }
            setUserId(session.user.id);
        });
    }, [navigate]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <div>
            <h1>내 프로필</h1>
            {user?.profile && <img src={user.profile} alt="profile" />}
            {user ? (
                <form onSubmit={onSubmit}>
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={
                            (e) => setUser({ ...user, name: e.currentTarget.value })
                        }
                        value={user.name}
                    />
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        disabled
                    />
                    <label htmlFor="profile">프로필:</label>
                    <input
                        type="file"
                        id="profile"
                        name="profile"
                        onChange={async (e) => {
                            console.log('profile');
                            const profile = e.currentTarget.files?.[0];
                            if (profile) {
                                const { data, error } = await supabaseClient.storage
                                    .from("profiles")
                                    .upload(`public/${new Date().getTime()}-${profile.name}`, profile);
                                if (error) {
                                    console.error(error);
                                } else {
                                    await supabaseClient.from("users").upsert({
                                        ...user,
                                        profile: `https://bzustdfdawuaenvqeojs.supabase.co/storage/v1/object/public/${data.fullPath}`,
                                    });
                                    await fetchUser();
                                }
                            }
                        }}
                    />
                    <button type="submit">수정</button>
                </form>
            ) : (
                <p>로그인이 필요합니다.</p>
            )}
            <button
                type="button"
                onClick={() => {
                    navigate("/")
                }}
            >
                홈으로
            </button>
        </div>
    );
}