import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../supabaseClient";
import { AuthError } from "@supabase/supabase-js";

export default function SignIn() {
    const navigate = useNavigate();
    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        if (error instanceof AuthError) {
            console.log("Error signing in:", error.name, error.message);
            throw error
        }
        return data;
    };

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const email = formData.get("email")?.toString() ?? '';
                const password = formData.get("password")?.toString() ?? '';
                await signIn(email, password);
                navigate("/");
            }}
        >
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" />
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" />
            <button type="submit">Sign In</button>
        </form>
    );
}