"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function SignInPage() {
	const [mode, setMode] = useState<"signin" | "signup">("signin");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { signUp, signIn, loading, message, setMessage } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage("");

		if (!email.endsWith("@stonybrook.edu")) {
			setMessage("Only @stonybrook.edu email addresses are allowed.");
			return;
		}

		if (mode === "signup") await signUp(email, password);
		else await signIn(email, password);
	};

	return (
		<div className="max-w-md mx-auto mt-20 border rounded-xl shadow px-8 py-10 bg-white">
			<h1 className="text-2xl font-bold text-center mb-2">Welcome to SBU Ranks</h1>
			<p className="text-center text-gray-500 text-sm mb-6">
				{mode === "signin" ? "Sign in to vote." : "Sign up to start voting."}
			</p>

			<div className="flex border border-gray-200 rounded-md mb-6 overflow-hidden">
				<button
					type="button"
					className={`w-1/2 py-2 text-sm font-medium ${
						mode === "signin" ? "bg-blue-100 text-blue-600" : "text-gray-600"
					}`}
					onClick={() => {
						setMode("signin");
						setMessage("");
					}}
				>
					Sign In
				</button>
				<button
					type="button"
					className={`w-1/2 py-2 text-sm font-medium ${
						mode === "signup" ? "bg-blue-100 text-blue-600" : "text-gray-600"
					}`}
					onClick={() => {
						setMode("signup");
						setMessage("");
					}}
				>
					Sign Up
				</button>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="email"
					required
					placeholder="you@stonybrook.edu"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
				/>
				<input
					type="password"
					required
					placeholder="Enter your password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
					>
					{loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
				</button>
			</form>

			{message && (
				<p className="text-sm text-center mt-4 text-gray-600">{message}</p>
			)}
		</div>
	);
}
