"use client"

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Trophy, Vote, BarChart2, Info, LogIn, LogOut, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [showLogout, setShowLogout] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const getUser = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setUserEmail(session?.user?.email ?? null);
		};
		getUser();

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
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
		setIsOpen(false);
	};
	
	const handleLinkClick = () => {
		if (setIsOpen) setIsOpen(false);
	};

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm">
			<div className="max-w-6xl mx-auto px-4 py-5 flex justify-between items-center">
				<Link href="/" onClick={handleLinkClick} className="text-xl font-bold flex items-center gap-2 text-red-600 whitespace-nowrap">
					<Trophy size={20} />
					SBU Ranks
				</Link>

				{/* Desktop nav */}
				<div className="hidden md:flex items-center space-x-6 text-sm">
					<NavLinks
						userEmail={userEmail}
						onSignOut={handleSignOut}
						setShowLogout={setShowLogout}
						showLogout={showLogout}
					/>
				</div>

				{/* Mobile toggle */}
				<button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile dropdown */}
			{isOpen && (
				<div className=" flex flex-col space-y-3 px-4 pb-4 divide-y divide-gray-200 text-sm">
					<NavLinks
						userEmail={userEmail}
						onSignOut={handleSignOut}
						setShowLogout={setShowLogout}
						showLogout={showLogout}
						setIsOpen={setIsOpen}
					/>
				</div>
			)}

		</nav>
	);
}

function NavLinks({
	userEmail,
	onSignOut,
	setShowLogout,
	showLogout,
	setIsOpen,
}: {
	userEmail: string | null;
	onSignOut: () => void;
	setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
	showLogout: boolean;
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const handleLinkClick = () => {
		if (setIsOpen) setIsOpen(false);
	};

	return (
		<>
			<Link href="/vote" onClick={handleLinkClick} className="hover:text-blue-500 flex items-center gap-1">
				<Vote size={16} /> Vote
			</Link>
			<Link href="/stats" onClick={handleLinkClick} className="hover:text-blue-500 flex items-center gap-1">
				<BarChart2 size={16} /> Stats
			</Link>
			<Link href="/about" onClick={handleLinkClick} className="hover:text-blue-500 flex items-center gap-1">
				<Info size={16} /> About
			</Link>

			{!userEmail ? (
				<Link href="/signin" onClick={handleLinkClick} className="hover:text-blue-500 flex items-center gap-1">
					<LogIn size={16} /> Sign In
				</Link>
			) : (
				<div className="relative">
					<button
						onClick={() => setShowLogout((prev) => !prev)}
						className="hover:text-blue-500 flex items-center gap-1"
					>
						{userEmail}
					</button>
					{showLogout && (
						<button
							onClick={onSignOut}
							className="mt-2 px-4 py-2 bg-gray-100 border rounded shadow text-sm flex items-center gap-2 hover:bg-gray-200"
						>
							<LogOut size={16} /> Sign Out
						</button>
					)}
				</div>
			)}
		</>
	);
}
