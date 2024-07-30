import React from 'react';
import { supabaseClient } from "../supabaseClient";
import { Database } from "../types/supabase";

type User = Database['public']['Tables']['users']['Row'];

interface ProfileFormProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    fetchUser: () => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, setUser, fetchUser }) => {
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name")?.toString() ?? "";
        await supabaseClient.from("users").upsert({
            ...user,
            name,
        });
        fetchUser();
    };

    const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) => setUser({ ...user, name: e.currentTarget.value })}
                    value={user.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                />
            </div>
            <div>
                <label htmlFor="profile" className="block text-sm font-medium text-gray-700">프로필:</label>
                <input
                    type="file"
                    id="profile"
                    name="profile"
                    onChange={handleProfileUpload}
                    className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                수정
            </button>
        </form>
    );
};
