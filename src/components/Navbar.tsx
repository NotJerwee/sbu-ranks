"use client"

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Trophy, Vote, BarChart2, Info, LogIn, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [showLogout, setShowLogout] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setUserEmail(session?.user?.email ?? null);
		};
		getUser();

		const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
			setUserEmail(session?.user?.email ?? null);
		});

		return () => {
		listener.subscription.unsubscribe();
		};
	}, []);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		setUserEmail(null);
		setShowLogout(false);
	};

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-6xl mx-auto py-5 flex justify-between items-center">
				<Link href="/" className="text-xl font-bold flex items-center gap-2 text-red-600">
					<Trophy size={20} />
					SBU Ranks
				</Link>
				<div className="space-x-10 text-m flex items-center">
				<Link href="/vote" className="hover:text-blue-500 transition inline-flex items-center gap-2">
					<Vote size={18} /> Vote
				</Link>
				<Link href="/stats" className="hover:text-blue-500 transition inline-flex items-center gap-2">
					<BarChart2 size={18} /> Stats
				</Link>
				<Link href="/about" className="hover:text-blue-500 transition inline-flex items-center gap-2">
					<Info size={18} /> About
				</Link>

				{!userEmail ? (
					<Link href="/signin" className="hover:text-blue-500 transition inline-flex items-center gap-2">
						<LogIn size={18} /> Sign In
					</Link>
				) : (
					<div className="relative">
						<button
							onClick={() => setShowLogout((prev) => !prev)}
							className="hover:text-blue-500 transition inline-flex items-center gap-2"
						>
							<span>{userEmail}</span>
						</button>
						{showLogout && (
							<button
								onClick={handleSignOut}
								className="absolute right-0 mt-2 px-4 py-2 bg-gray-100 border rounded shadow text-sm flex items-center gap-2 hover:bg-gray-200"
							>
								<LogOut size={16} /> Sign Out
							</button>
						)}
					</div>
				)}
				</div>
			</div>
		</nav>
	);
}
