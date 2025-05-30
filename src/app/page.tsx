'use client';

import { Landmark, ArrowRight } from 'lucide-react';

export default function Home() {
	return (
		<main className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 py-16 overflow-hidden">
			<FloatingExamples />

			<div className="relative z-10">
				<h1 className="text-3xl flex items-center justify-center gap-3 font-bold mb-4">
					<Landmark size={30} /> Welcome to SBU Ranks
				</h1>

				<p className="text-m text-gray-600 max-w-xl mb-6">
					Vote once per day in categories like best food, study spot, and more. See what students love about Stony Brook University!
				</p>

				<a
					href="/vote"
					className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
				>
					Start Voting
					<ArrowRight size={18} />
				</a>
			</div>
		</main>
	);
}

function FloatingExamples() {
	return (
		<div className="absolute inset-0 opacity-70 pointer-events-none">
			<FloatingCard
				className="top-15 left-30 rotate-[4deg] animate-float"
				title="Better Dining Hall?"
				blue="East Side Dining Hall 🍽️"
				red="West Side Dining Hall 🍕"
			/>
			<FloatingCard
				className="top-[25%] right-[20%] rotate-[6deg] animate-[float_5s_ease-in-out_infinite]"
				title="Top Study Spot?"
				blue="Melville Library 📚"
				red="Union Lounge 🛋️"
			/>
			<FloatingCard
				className="left-[30%] bottom-[20%] -rotate-[8deg] animate-[float_6.5s_ease-in-out_infinite]"
				title="Best Bathroom?"
				blue="Charles B. Wang Center"
				red="Javits Lecture Center"
			/>
		</div>
	);
}

function FloatingCard({
	className = '',
	title,
	blue,
	red,
}: {
	className?: string;
	title: string;
	blue: string;
	red: string;
}) {
	return (
		<div
			className={`hidden sm:block absolute bg-white/90 backdrop-blur-sm border shadow-lg rounded-lg p-6 w-64 text-center ${className}`}
		>
			<h3 className="font-semibold text-gray-800 mb-1 text-sm">{title}</h3>
			<p className="text-blue-600 text-base font-semibold">{blue}</p>
			<p className="text-sm text-gray-400">vs</p>
			<p className="text-red-500 text-base font-semibold">{red}</p>
		</div>
	);
}
