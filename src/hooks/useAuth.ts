import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const signUp = async (email: string, password: string) => {
		setLoading(true);
		const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { emailRedirectTo: `${window.location.origin}/signin` },
		});

		setMessage(error ? error.message : "Check your email to confirm your account.");
		setLoading(false);
	};

	const signIn = async (email: string, password: string) => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		setMessage(error ? error.message : "Success! Redirecting...");
		if (!error) window.location.href = "/vote";

		setLoading(false);
	};

	return { signUp, signIn, loading, message, setMessage };
}
